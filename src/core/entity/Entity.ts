/**
 * Created by Papa on 4/21/2016.
 */
import {
	IQRelation, JSONEntityRelation, JSONRelationType, JSONRelation, JSONJoinRelation, QRelation,
	JSONViewJoinRelation
} from "./Relation";
import {JSONBaseOperation, IOperation} from "../operation/Operation";
import {FieldColumnAliases} from "./Aliases";
import {JoinType, JoinFields} from "./Joins";
import {IQOperableField} from "../field/OperableField";
import {PHRawMappedSQLQuery, PHMappedSQLQuery} from "../../query/sql/query/ph/PHMappedSQLQuery";
import {PHAbstractSQLQuery} from "../../query/sql/query/ph/PHAbstractSQLQuery";

/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
	'*'?: null | undefined;
}

export interface IFrom {

	fullJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF>;

	innerJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF>;

	leftJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF>;

	rightJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF>;

}


export interface IQEntity {

	__qEntityConstructor__: {new ( ...args: any[] ): any};
	__entityConstructor__: {new (): any};
	__entityFieldMap__: {[propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>};
	__entityName__: string;
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any>};
	currentChildIndex: number;
	fromClausePosition: number[];
	relationPropertyName: string;
	joinType: JoinType;
	joinWhereClause: JSONBaseOperation;
	parentJoinEntity: IQEntity;

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

	getRelationJson( columnAliases: FieldColumnAliases ): JSONRelation;

	isRootEntity(): boolean;
	getRootJoinEntity(): IQEntity;
}

export abstract class QEntity<IQ extends IQEntity> implements IQEntity, IFrom {

	__entityFieldMap__: {[propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>} = {};
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any>} = {};

	// rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);

	currentChildIndex = 0;
	joinWhereClause: JSONBaseOperation;
	parentJoinEntity: IQEntity;

	constructor(
		public __qEntityConstructor__: {new( ...args: any[] ): IQ},
		public __entityConstructor__: {new(): any},
		public __entityName__: string,
		public fromClausePosition: number[] = [],
		public relationPropertyName = null,
		public joinType: JoinType = null
	) {
	}

	getInstance(): IQ {
		let instance = new this.__qEntityConstructor__(this.__qEntityConstructor__, this.__entityConstructor__, this.__entityName__, this.fromClausePosition, this.relationPropertyName, this.joinType);

		instance.currentChildIndex = this.currentChildIndex;
		instance.joinWhereClause = this.joinWhereClause;
		instance.__entityFieldMap__ = this.__entityFieldMap__;
		instance.__entityRelationMap__ = this.__entityRelationMap__;

		return instance;
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

	getRelationJson( columnAliases: FieldColumnAliases ): JSONRelation {
		let jsonRelation: JSONRelation = {
			currentChildIndex: this.currentChildIndex,
			entityName: this.__entityName__,
			fromClausePosition: this.fromClausePosition,
			joinType: this.joinType,
			relationType: null,
			rootEntityPrefix: columnAliases.entityAliases.getNextAlias(this.getRootJoinEntity())
		};
		if (this.joinWhereClause) {
			this.getJoinRelationJson(<JSONJoinRelation>jsonRelation, columnAliases);
		} else if (this.relationPropertyName) {
			this.getEntityRelationJson(<JSONEntityRelation>jsonRelation);
		} else {
			this.getRootRelationJson(jsonRelation, columnAliases);
		}
		return jsonRelation;
	}

	getJoinRelationJson(
		jsonRelation: JSONJoinRelation,
		columnAliases: FieldColumnAliases
	): JSONJoinRelation {
		jsonRelation.relationType = JSONRelationType.ENTITY_JOIN_ON;
		jsonRelation.joinWhereClause = PHAbstractSQLQuery.whereClauseToJSON(this.joinWhereClause, columnAliases);

		return jsonRelation;
	}

	getEntityRelationJson( jsonRelation: JSONEntityRelation ): JSONEntityRelation {
		jsonRelation.relationType = JSONRelationType.ENTITY_SCHEMA_RELATION;
		jsonRelation.relationPropertyName = this.relationPropertyName;

		return jsonRelation;
	}

	getRootRelationJson(
		jsonRelation: JSONRelation,
		columnAliases: FieldColumnAliases
	): JSONJoinRelation {
		jsonRelation.relationType = (this instanceof QView) ? JSONRelationType.SUB_QUERY_ROOT : JSONRelationType.ENTITY_ROOT;

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

	join<IF extends IFrom>(
		right: IF,
		joinType: JoinType
	): JoinFields<IF> {
		let joinChild: IQEntity = (<QEntity<any>><any>right).getInstance();
		joinChild.currentChildIndex = 0;
		let nextChildPosition = QRelation.getNextChildJoinPosition(this);
		joinChild.fromClausePosition = nextChildPosition;
		joinChild.joinType = joinType;
		joinChild.parentJoinEntity = this;

		return new JoinFields<IF>(right);
	}

	isRootEntity(): boolean {
		return !this.parentJoinEntity;
	}

	getRootJoinEntity(): IQEntity {
		let rootEntity: IQEntity = this;
		while (rootEntity.parentJoinEntity) {
			rootEntity = rootEntity.parentJoinEntity;
		}
		return rootEntity;
	}

	fullJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF> {
		return this.join<IF>(right, JoinType.FULL_JOIN);
	}

	innerJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF> {
		return this.join<IF>(right, JoinType.INNER_JOIN);
	}

	leftJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF> {
		return this.join<IF>(right, JoinType.LEFT_JOIN);
	}

	rightJoin<IF extends IFrom>(
		right: IF
	): JoinFields<IF> {
		return this.join<IF>(right, JoinType.RIGHT_JOIN);
	}

}

export class QView extends QEntity<QView> implements IQEntity, IFrom {

	constructor(
		public fromClausePosition: number[] = [],
		public subQuery: PHRawMappedSQLQuery<any>
	) {
		super(QView, null, null, fromClausePosition, null, null);
	}

	getInstance(): QView {
		let instance = super.getInstance();
		instance.subQuery = this.subQuery;

		return instance;
	}

	getJoinRelationJson(
		jsonRelation: JSONViewJoinRelation,
		columnAliases: FieldColumnAliases
	): JSONViewJoinRelation {
		jsonRelation = <JSONViewJoinRelation>super.getJoinRelationJson(jsonRelation, columnAliases);
		jsonRelation.relationType = JSONRelationType.SUB_QUERY_JOIN_ON;
		jsonRelation.subQuery = new PHMappedSQLQuery(this.subQuery, columnAliases.entityAliases).toJSON();

		return jsonRelation;
	}

	getRootRelationJson(
		jsonRelation: JSONViewJoinRelation,
		columnAliases: FieldColumnAliases
	): JSONViewJoinRelation {
		jsonRelation = <JSONViewJoinRelation>super.getJoinRelationJson(jsonRelation, columnAliases);
		jsonRelation.relationType = JSONRelationType.SUB_QUERY_ROOT;
		jsonRelation.subQuery = new PHMappedSQLQuery(this.subQuery, columnAliases.entityAliases).toJSON();

		return jsonRelation;
	}

}
