import {IQEntity, QEntity, IFrom, IJoinParent} from "./Entity";
import {JSONBaseOperation} from "../operation/Operation";
import {getNextRootEntityName} from "./Aliases";
import {PHRawMappedSQLQuery} from "../../query/sql/query/ph/PHMappedSQLQuery";
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

export enum JoinType {
	FULL_JOIN,
	INNER_JOIN,
	LEFT_JOIN,
	RIGHT_JOIN
}

export interface JSONRelation {
	rootEntityName: string;
	fromClausePosition: number[];
	entityName: string;
	joinType: JoinType;
	relationPropertyName: string;
}

export interface IQRelation<IQR extends IQEntity, R, IQ extends IQEntity> {

	relationType: RelationType;
	relationEntityConstructor: new () => R;
	relationQEntityConstructor: new () => IQR;
	innerJoin();
	leftJoin();

}

export const IS_ENTITY_PROPERTY_NAME = '.isEntity';

export abstract class QRelation<IQR extends IQEntity, R, IQ extends IQEntity>
implements IQRelation<IQR, R, IQ> {
	/*
	 static isStub(object:any) {
	 return !object[IS_ENTITY_PROPERTY_NAME];
	 }

	 static markAsEntity(object:any) {
	 object[IS_ENTITY_PROPERTY_NAME] = true;
	 }
	 */

	static getPositionAlias(
		rootEntityName: string,
		fromClausePosition: number[]
	) {
		return `${rootEntityName}_${fromClausePosition.join('_')}`;
	}

	static getAlias( jsonRelation: JSONRelation ): string {
		return this.getPositionAlias(jsonRelation.rootEntityName, jsonRelation.fromClausePosition);
	}

	static getParentAlias( jsonRelation: JSONRelation ): string {
		let position = jsonRelation.fromClausePosition;
		if (position.length === 0) {
			throw `Cannot find alias of a parent entity for the root entity`;
		}
		return this.getPositionAlias(jsonRelation.rootEntityName, position.slice(0, position.length - 1));
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
		return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, QRelation.getNextChildJoinPosition(this.q), this.propertyName, joinType);
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

	static getNextChildJoinPosition( joinParent: IJoinParent ): number[] {
		let nextChildJoinPosition = joinParent.fromClausePosition.slice();
		nextChildJoinPosition.push(++joinParent.currentChildIndex);

		return nextChildJoinPosition;
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

export interface JoinOperation<IF extends IFrom, EMap> {
	( entity: IF | EMap ): JSONBaseOperation;
}

export class JoinFields<IF extends IFrom, EMap> {

	constructor(
		private joinTo: IF | PHRawMappedSQLQuery<EMap>
	) {
	}

	on( joinOperation: JoinOperation<IF, EMap> ): IF | EMap {
		let entity;
		let joinChild:IJoinParent;
		if (this.joinTo instanceof QEntity) {
			entity = this.joinTo;
			joinChild = <IJoinParent><any>this.joinTo;
		} else {
			let joinChild = <PHRawMappedSQLQuery<EMap>>this.joinTo;
			entity = joinChild.select;
		}
		joinChild.joinWhereClause = joinOperation(entity);

		return entity;
	}
}

function join<IF extends IFrom, EMap>(
	left: IF | PHRawMappedSQLQuery<EMap>,
	right: IF | PHRawMappedSQLQuery<EMap>,
  joinType:JoinType
): JoinFields<IF, EMap> {
	let nextChildPosition;
	let joinParent: IJoinParent = <IJoinParent><any>left;
	// If left is a Raw Mapped Query
	if (!(left instanceof QEntity)) {
		// If this is a root entity
		if (!joinParent.currentChildIndex) {
			joinParent.currentChildIndex = 0;
			joinParent.fromClausePosition = [];
			joinParent.rootEntityPrefix = getNextRootEntityName()
		}
	}
	nextChildPosition = QRelation.getNextChildJoinPosition(joinParent);

	let joinChild: IJoinParent = <IJoinParent><any>right;
	joinParent.currentChildIndex = 0;
	joinChild.fromClausePosition = nextChildPosition;
	joinChild.joinType = joinType;
	joinChild.rootEntityPrefix = joinParent.rootEntityPrefix;

	return new JoinFields<IF, EMap>(right);
}

export function fullJoin<IF extends IFrom, EMap>(
	left: IF | PHRawMappedSQLQuery<EMap>,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.FULL_JOIN);
}

export function innerJoin<IF extends IFrom, EMap>(
	left: IF | PHRawMappedSQLQuery<EMap>,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.INNER_JOIN);
}

export function leftJoin<IF extends IFrom, EMap>(
	left: IF | PHRawMappedSQLQuery<EMap>,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.LEFT_JOIN);
}

export function rightJoin<IF extends IFrom, EMap>(
	left: IF | PHRawMappedSQLQuery<EMap>,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.RIGHT_JOIN);
}