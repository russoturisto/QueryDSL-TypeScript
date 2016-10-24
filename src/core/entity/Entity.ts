/**
 * Created by Papa on 4/21/2016.
 */
import {IQField} from "../field/Field";
import {IQRelation, JSONRelation, JoinFields} from "./Relation";
import {JoinType, PHRawMappedSQLQuery} from "../../query/sql/PHSQLQuery";
import {JSONBaseOperation, IOperation} from "../operation/Operation";
import {getNextRootEntityName} from "./Aliases";
import {IQNumberField} from "../field/NumberField";
import {IQBooleanField} from "../field/BooleanField";
import {IQDateField} from "../field/DateField";
import {IQStringField} from "../field/StringField";

/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
	'*'?: null | undefined;
}

export interface IFrom {

}

export interface IJoinParent {

	currentChildIndex;
	fromClausePosition: number[];
	joinType: JoinType;
	joinWhereClause?:JSONBaseOperation;
	relationPropertyName?:string;
	rootEntityPrefix: string;

}

export interface IQEntity extends IJoinParent {

	__qEntityConstructor__: {new ( ...args: any[] ): any};
	__entityConstructor__: {new (): any};
	__entityFieldMap__: {[propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>};
	__entityName__: string;
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any, IQEntity>};


	addEntityRelation<IQR extends IQEntity, R>(
		propertyName: string,
		relation: IQRelation<IQR, R, IQEntity>
	): void;

	addEntityField<IQF extends IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>>(
		propertyName: string,
		field: IQF
	): void;

	fields(
		fields: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]
	): IQEntity;

	/*
	 joinOn<T, C extends IQField<IQ>>(
	 comparisonOp:IQField<IQ>
	 );
	 */

	getRelationJson(): JSONRelation;

	getNextChildJoinPosition(): number[];

}

export abstract class QEntity<IQ extends IQEntity> implements IQEntity, IFrom {

	__entityFieldMap__: {[propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>} = {};
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any, IQEntity>} = {};

	// rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);

	currentChildIndex = 0;

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
		relation: IQRelation<IQR, R, IQ>
	): void {
		this.__entityRelationMap__[propertyName] = relation;
	}

	addEntityField<T, IQF extends IQField<IQ, T, JSONBaseOperation, IOperation<T, JSONBaseOperation>, any>>(
		propertyName: string,
		field: IQF
	): void {
		this.__entityFieldMap__[propertyName] = field;
	}

	getRelationJson(): JSONRelation {
		return {
			rootEntityName: this.rootEntityPrefix,
			fromClausePosition: this.fromClausePosition,
			entityName: this.__entityName__,
			joinType: this.joinType,
			relationPropertyName: this.relationPropertyName
		};
	}

	getQ(): IQ {
		return <any>this;
	}

	fields(
		fields: IQField<IQ, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]
	): IQ {
		throw `Not implemented`;
	}

	abstract toJSON();

}
