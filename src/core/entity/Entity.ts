/**
 * Created by Papa on 4/21/2016.
 */
import {IQRelation, JSONEntityRelation, JSONRelationType, JSONRelation, JSONJoinRelation} from "./Relation";
import {JSONBaseOperation, IOperation} from "../operation/Operation";
import {getNextRootEntityName} from "./Aliases";
import {JoinType} from "./Joins";
import {IQOperableField} from "../field/OperableField";

/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
	'*'?: null | undefined;
}

export interface IFrom {

}


export interface IQEntity {

	__qEntityConstructor__: {new ( ...args: any[] ): any};
	__entityConstructor__: {new (): any};
	__entityFieldMap__: {[propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>};
	__entityName__: string;
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any>};
	currentChildIndex:number;
	rootEntityPrefix: string;
	fromClausePosition: number[];
	relationPropertyName: string;
	joinType: JoinType;


	addEntityRelation<IQR extends IQEntity, R>(
		propertyName: string,
		relation: IQRelation<IQR, R>
	): void;

	addEntityField<IQF extends IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>>(
		propertyName: string,
		field: IQF
	): void;

	fields(
		fields: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]
	): IQEntity;

	/*
	 joinOn<T, C extends IQOperableField<IQ>>(
	 comparisonOp:IQOperableField<IQ>
	 );
	 */

	getRelationJson(): JSONRelation;

}

export abstract class QEntity<IQ extends IQEntity> implements IQEntity, IFrom {

	__entityFieldMap__: {[propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>} = {};
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any>} = {};

	// rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);

	currentChildIndex = 0;
	joinWhereClause: JSONBaseOperation;

	constructor(
		public __qEntityConstructor__: {new( ...args: any[] ): any},
		public __entityConstructor__: {new(): any},
		public __entityName__: string,
		public rootEntityPrefix: string = getNextRootEntityName(),
		public fromClausePosition: number[] = [],
		public relationPropertyName = null,
		public joinType: JoinType = null
	) {
	}

	addEntityRelation<IQR extends IQEntity, R>(
		propertyName: string,
		relation: IQRelation<IQR, R>
	): void {
		this.__entityRelationMap__[propertyName] = relation;
	}

	addEntityField<T, IQF extends IQOperableField<T, JSONBaseOperation, IOperation<T, JSONBaseOperation>, any>>(
		propertyName: string,
		field: IQF
	): void {
		this.__entityFieldMap__[propertyName] = field;
	}

	getRelationJson(): JSONRelation {
		let jsonRelation: JSONRelation = {
			currentChildIndex: this.currentChildIndex,
			entityName: this.__entityName__,
			fromClausePosition: this.fromClausePosition,
			joinType: this.joinType,
			relationType: null,
			rootEntityPrefix: this.rootEntityPrefix
		};
		if (this.joinWhereClause) {
			this.getJoinRelationJson(<JSONJoinRelation>jsonRelation);
		} else if (this.relationPropertyName) {
			this.getEntityRelationJson(<JSONEntityRelation>jsonRelation);
		} else {
			this.getRootRelationJson(jsonRelation);
		}
		return jsonRelation;
	}

	getJoinRelationJson( jsonRelation: JSONJoinRelation ): JSONJoinRelation {
		jsonRelation.relationType = JSONRelationType.ENTITY_JOIN_ON;
		jsonRelation.joinWhereClause = this.joinWhereClause;

		return jsonRelation;
	}

	getEntityRelationJson( jsonRelation: JSONEntityRelation ): JSONEntityRelation {
		jsonRelation.relationType = JSONRelationType.ENTITY_SCHEMA_RELATION;
		jsonRelation.relationPropertyName = this.relationPropertyName;

		return jsonRelation;
	}

	getRootRelationJson( jsonRelation: JSONRelation ): JSONJoinRelation {
		jsonRelation.relationType = JSONRelationType.ENTITY_ROOT;

		return jsonRelation;
	}


	getQ(): IQ {
		return <any>this;
	}

	fields(
		fields: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]
	): IQ {
		throw `Not implemented`;
	}

	abstract toJSON();

}
