import {IQEntity, QEntity} from "./Entity";
import {JoinType} from "../../query/sql/PHSQLQuery";
/**
 * Created by Papa on 4/26/2016.
 */

const ALIASES = ['a', 'b', 'c', 'd', 'e',
	'f', 'g', 'h', 'i', 'j',
	'k', 'l', 'm', 'n', 'o',
	'p', 'q', 'r', 's', 't',
	'u', 'v', 'w', 'x', 'y', 'z'];

export class ColumnAliases {
	numFields:number = 0;
	private lastAlias = [-1, -1];
	private columnAliasMap: {[aliasPropertyCombo: string]: string} = {};

	addAlias(tableAlias:string, propertyName:string):string {
		let aliasKey = this.getAliasKey(tableAlias, propertyName);
		let columnAlias = this.getNextAlias();
		this.columnAliasMap[aliasKey] = columnAlias;
		this.numFields++;

		return columnAlias;
	}

	getAlias(tableAlias:string, propertyName:string):string {
		let aliasKey = this.getAliasKey(tableAlias, propertyName);
		return this.columnAliasMap[aliasKey];
	}

	private getAliasKey(tableAlias:string, propertyName:string):string {
		let aliasKey = `${tableAlias}.${propertyName}`;
		return aliasKey;
	}

	private getNextAlias(): string {
		let currentAlias = this.lastAlias;
		for (var i = 1; i >= 0; i--) {
			let currentIndex = currentAlias[i];
			currentIndex = (currentIndex + 1) % 26;
			currentAlias[i] = currentIndex;
			if (currentIndex !== 0) {
				break;
			}
		}
		let aliasString = '';
		for (var i = 0; i < 2; i++) {
			aliasString += ALIASES[currentAlias[i]];
		}

		return aliasString;
	}
}

export class JoinTreeNode {
	constructor(
		public jsonRelation: JSONRelation,
		public childNodes: JoinTreeNode[]
	) {
	}

	addChildNode(
		joinTreeNode: JoinTreeNode
	): void {
		let childPositionArray = joinTreeNode.jsonRelation.fromClausePosition;
		let childPosition = childPositionArray[childPositionArray.length - 1];
		this.childNodes[childPosition] = joinTreeNode;
	}

	getChildNode(
		entityName: string,
		relationName: string
	): JoinTreeNode {
		let matchingNodes = this.childNodes.filter(( childNode ) => {
			return childNode.jsonRelation.relationPropertyName === relationName;
		});
		switch (matchingNodes.length) {
			case 0:
				break;
			case 1:
				return matchingNodes[0];
			default:
				throw `More than one child node matched relation property name '${relationName}'`;
		}
		let childPosition = this.jsonRelation.fromClausePosition.slice();
		childPosition.push(this.childNodes.length);
		let childTreeNode = new JoinTreeNode({
			fromClausePosition: childPosition,
			entityName: entityName,
			joinType: JoinType.LEFT_JOIN,
			relationPropertyName: relationName
		}, []);
		this.addChildNode(childTreeNode);

		return childTreeNode;
	}
}

export interface RelationRecord {

	entityName: string;
	propertyName: string;
	relationType: RelationType;

}

export enum RelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export interface JSONRelation {
	fromClausePosition: number[];
	entityName: string;
	joinType: JoinType;
	relationPropertyName: string;
}

export const INNER_JOIN = 'INNER_JOIN';
export const LEFT_JOIN = 'LEFT_JOIN';

export interface IQRelation<IQR extends IQEntity, R, IQ extends IQEntity> {

	entityName: string;
	q: IQ;
	qConstructor: new () => IQ,
	propertyName: string;
	relationType: RelationType;
	relationEntityConstructor: new () => R;
	relationQEntityConstructor: new () => IQR;
	innerJoin();
	leftJoin();

}

export const IS_ENTITY_PROPERTY_NAME = '.isEntity';

export class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {

	static isStub(object:any) {
		return !object[IS_ENTITY_PROPERTY_NAME];
	}

	static markAsEntity(object:any) {
		object[IS_ENTITY_PROPERTY_NAME] = true;
	}

	static getPositionAlias( fromClausePosition: number[] ) {
		return `rt_${fromClausePosition.join('_')}`;
	}

	static getAlias( jsonRelation: JSONRelation ): string {
		return this.getPositionAlias(jsonRelation.fromClausePosition);
	}

	static getParentAlias( jsonRelation: JSONRelation ): string {
		let position = jsonRelation.fromClausePosition;
		if (position.length === 0) {
			throw `Cannot find alias of a parent entity for the root entity`;
		}
		return this.getPositionAlias(position.slice(0, position.length - 1));
	}

	constructor(
		public q: IQ,
		public qConstructor: new () => IQ,
		public relationType: RelationType,
		public entityName: string,
		public propertyName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQR
	) {
		this.q.addEntityRelation(propertyName, this);
	}

	innerJoin(): IQR {
		return this.getNewQEntity(JoinType.INNER_JOIN);
	}

	leftJoin(): IQR {
		return this.getNewQEntity(JoinType.LEFT_JOIN);
	}

	private getNewQEntity( joinType: JoinType ) {
		return new this.relationQEntityConstructor(this.relationEntityConstructor, this.entityName, this.q.getNextChildJoinPosition(), this.propertyName, joinType);
	}

}