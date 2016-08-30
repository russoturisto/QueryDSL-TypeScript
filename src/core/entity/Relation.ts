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

var currentAlias = [0, 0, 0, 0, 0];

function getNextAlias(): string {
	for (var i = 4; i >= 0; i--) {
		let currentIndex = currentAlias[i];
		currentIndex = (currentIndex + 1) % 26;
		currentAlias[i] = currentIndex;
		if (currentIndex !== 0) {
			break;
		}
	}
	let aliasString = '';
	for (var i = 0; i < 5; i++) {
		aliasString += ALIASES[currentAlias[i]];
	}

	return aliasString;
}

export interface RelationRecord {

	entityName: string;
	decoratorElements: {[key: string]: any};
	propertyName: string;
	relationType: RelationType;

}

export enum RelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export interface JSONRelation {
	alias: string;
	entityName:string;
	joinType: JoinType;
	parentEntityAlias: string;
	relationPropertyName:string;
}

export const INNER_JOIN = 'INNER_JOIN';
export const LEFT_JOIN = 'LEFT_JOIN';

export interface IQRelation<IQR extends IQEntity, R, IQ extends IQEntity> {

	q: IQ;
	qConstructor: new () => IQ,
	propertyName: string;
	relationType: RelationType;
	relationEntityConstructor: new () => R;
	relationQEntityConstructor: new () => IQR;
	innerJoin();
	leftJoin();

}

export class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {

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
		return new this.relationQEntityConstructor(this.relationEntityConstructor, this.entityName, getNextAlias(), this.q.alias, this.propertyName, joinType);
	}

}