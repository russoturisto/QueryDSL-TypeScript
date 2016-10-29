import {IQEntity} from "./Entity";
import {JSONBaseOperation} from "../operation/Operation";
import {JoinType} from "./Joins";
/**
 * Created by Papa on 4/26/2016.
 */

export interface EntityRelationRecord {
	entityName: string;
	propertyName: string;
	relationType: EntityRelationType;
}

export enum EntityRelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export enum JSONRelationType {
	// Join of an entity with the ON clause
	ENTITY_JOIN_ON,
		// Join of an entity via a schema relation
	ENTITY_SCHEMA_RELATION,
		// The root entity in a join
	ENTITY_ROOT,
		// Join of a sub-query (with the ON clause)
	SUB_QUERY_JOIN_ON,
		// The root sub-query in a join
	SUB_QUERY_ROOT
}

export interface JSONRelation {
	currentChildIndex: number;
	entityName?: string;
	fromClausePosition: number[];
	joinType: JoinType;
	relationType: JSONRelationType;
	rootEntityPrefix: string;
}

export interface JSONJoinRelation extends JSONRelation {
	joinWhereClause?: JSONBaseOperation;
}

export interface JSONEntityRelation extends JSONRelation {
	relationPropertyName: string;
}

export interface IQRelation<IQR extends IQEntity, R, IQ extends IQEntity> {

	relationType: EntityRelationType;
	relationEntityConstructor: new () => R;
	relationQEntityConstructor: new () => IQR;
	innerJoin();
	leftJoin();

}

export const IS_ENTITY_PROPERTY_NAME = '.isEntity';

export abstract class QRelation {
	/*
	 static isStub(object:any) {
	 return !object[IS_ENTITY_PROPERTY_NAME];
	 }

	 static markAsEntity(object:any) {
	 object[IS_ENTITY_PROPERTY_NAME] = true;
	 }
	 */

	static getPositionAlias(
		rootEntityPrefix: string,
		fromClausePosition: number[]
	) {
		return `${rootEntityPrefix}_${fromClausePosition.join('_')}`;
	}

	static getAlias( jsonRelation: JSONRelation ): string {
		return this.getPositionAlias(jsonRelation.rootEntityPrefix, jsonRelation.fromClausePosition);
	}

	static getParentAlias( jsonRelation: JSONRelation ): string {
		let position = jsonRelation.fromClausePosition;
		if (position.length === 0) {
			throw `Cannot find alias of a parent entity for the root entity`;
		}
		return this.getPositionAlias(jsonRelation.rootEntityPrefix, position.slice(0, position.length - 1));
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
			// always attempt to graph relationPropertyName
			(<JSONEntityRelation>joinRelation).relationPropertyName,
			joinRelation.joinType);
	}

	static getNextChildJoinPosition( joinParent: JSONJoinRelation | IQEntity ): number[] {
		let nextChildJoinPosition = joinParent.fromClausePosition.slice();
		nextChildJoinPosition.push(++joinParent.currentChildIndex);

		return nextChildJoinPosition;
	}

}

