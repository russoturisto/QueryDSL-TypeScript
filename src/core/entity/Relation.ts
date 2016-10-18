import {IQEntity, QEntity} from "./Entity";
import {JoinType} from "../../query/sql/PHSQLQuery";
import {Orderable} from "../field/Field";
import {JSONFieldInOrderBy, SortOrder, FieldInOrderBy} from "../field/FieldInOrderBy";
/**
 * Created by Papa on 4/26/2016.
 */

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

export interface IQManyToOneRelation <IQR extends IQEntity, R, IQ extends IQEntity>
extends IQRelation<IQR, R, IQ>, Orderable<IQ> {
}

export const IS_ENTITY_PROPERTY_NAME = '.isEntity';

export abstract class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {
	/*
	 static isStub(object:any) {
	 return !object[IS_ENTITY_PROPERTY_NAME];
	 }

	 static markAsEntity(object:any) {
	 object[IS_ENTITY_PROPERTY_NAME] = true;
	 }
	 */

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

	private getNewQEntity( joinType: JoinType ): IQR {
		return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, this.q.getNextChildJoinPosition(), this.propertyName, joinType);
	}

	static createRelatedQEntity<IQ extends IQEntity>(
		joinRelation: JSONRelation,
		entityMapByName: {[entityName: string]: IQEntity}
	): IQ {
		let genericIQEntity = entityMapByName[joinRelation.entityName];
		return new genericIQEntity.__qEntityConstructor__(
			genericIQEntity.__qEntityConstructor__,
			genericIQEntity.__entityConstructor__,
			joinRelation.entityName,
			joinRelation.fromClausePosition,
			joinRelation.relationPropertyName,
			joinRelation.joinType);
	}

}

export class QManyToOneRelation<IQR extends IQEntity, R, IQ extends IQEntity>
extends QRelation<IQR, R, IQ> implements IQManyToOneRelation<IQR, R, IQ> {

	constructor(
		public q: IQ,
		public qConstructor: new () => IQ,
		public entityName: string,
		public propertyName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQR
	) {
		super(q, qConstructor, RelationType.MANY_TO_ONE, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor);
	}

	get fieldName():string {
		return this.propertyName;
	}

	asc(): JSONFieldInOrderBy {
		return new FieldInOrderBy<IQ>(this, SortOrder.ASCENDING).toJSON();
	}

	desc(): JSONFieldInOrderBy {
		return new FieldInOrderBy<IQ>(this, SortOrder.DESCENDING).toJSON();
	}

}

export class QOneToManyRelation<IQR extends IQEntity, R, IQ extends IQEntity>
extends QRelation<IQR, R, IQ> {

	constructor(
		public q: IQ,
		public qConstructor: new () => IQ,
		public entityName: string,
		public propertyName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQR
	) {
		super(q, qConstructor, RelationType.ONE_TO_MANY, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor);
	}

}