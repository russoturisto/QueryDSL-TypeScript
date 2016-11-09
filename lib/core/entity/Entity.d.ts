/**
 * Created by Papa on 4/21/2016.
 */
import { IQRelation, JSONEntityRelation, JSONRelation, JSONJoinRelation, JSONViewJoinRelation } from "./Relation";
import { JSONBaseOperation, IOperation } from "../operation/Operation";
import { FieldColumnAliases } from "./Aliases";
import { JoinType, JoinFields } from "./Joins";
import { IQOperableField } from "../field/OperableField";
import { PHRawMappedSQLQuery } from "../../query/sql/query/ph/PHMappedSQLQuery";
/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
    '*'?: null | undefined;
}
export interface IFrom {
    fullJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    innerJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    leftJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    rightJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
}
export interface IEntityRelationFrom {
}
export interface IQEntity {
    __qEntityConstructor__: {
        new (...args: any[]): any;
    };
    __entityConstructor__: {
        new (): any;
    };
    __entityFieldMap__: {
        [propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation, any>;
    };
    __entityName__: string;
    __entityRelationMap__: {
        [propertyName: string]: IQRelation;
    };
    currentChildIndex: number;
    fromClausePosition: number[];
    relationPropertyName: string;
    joinType: JoinType;
    joinWhereClause: JSONBaseOperation;
    parentJoinEntity: IQEntity;
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation): void;
    addEntityField<IQF extends IQOperableField<any, JSONBaseOperation, IOperation, any>>(propertyName: string, field: IQF): void;
    fields(fields: IQOperableField<any, JSONBaseOperation, IOperation, any>[]): IQEntity;
    getRelationJson(columnAliases: FieldColumnAliases): JSONRelation;
    isRootEntity(): boolean;
    getRootJoinEntity(): IQEntity;
}
export declare abstract class QEntity<IQ extends IQEntity> implements IQEntity, IFrom, IEntityRelationFrom {
    __qEntityConstructor__: {
        new (...args: any[]): IQ;
    };
    __entityConstructor__: {
        new (): any;
    };
    __entityName__: string;
    fromClausePosition: number[];
    relationPropertyName: any;
    joinType: JoinType;
    __entityFieldMap__: {
        [propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation, any>;
    };
    __entityRelationMap__: {
        [propertyName: string]: IQRelation;
    };
    currentChildIndex: number;
    joinWhereClause: JSONBaseOperation;
    parentJoinEntity: IQEntity;
    constructor(__qEntityConstructor__: {
        new (...args: any[]): IQ;
    }, __entityConstructor__: {
        new (): any;
    }, __entityName__: string, fromClausePosition?: number[], relationPropertyName?: any, joinType?: JoinType);
    getInstance(): IQ;
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation): void;
    addEntityField<T, IQF extends IQOperableField<T, JSONBaseOperation, IOperation, any>>(propertyName: string, field: IQF): void;
    getRelationJson(columnAliases: FieldColumnAliases): JSONRelation;
    getJoinRelationJson(jsonRelation: JSONJoinRelation, columnAliases: FieldColumnAliases): JSONJoinRelation;
    getEntityRelationJson(jsonRelation: JSONEntityRelation): JSONEntityRelation;
    getRootRelationJson(jsonRelation: JSONRelation, columnAliases: FieldColumnAliases): JSONJoinRelation;
    getQ(): IQ;
    fields(fields: IQOperableField<any, JSONBaseOperation, IOperation, any>[]): IQ;
    join<IF extends IFrom>(right: IF, joinType: JoinType): JoinFields<IF>;
    isRootEntity(): boolean;
    getRootJoinEntity(): IQEntity;
    fullJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    innerJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    leftJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    rightJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
}
export declare class QView extends QEntity<QView> implements IQEntity, IFrom {
    fromClausePosition: number[];
    subQuery: PHRawMappedSQLQuery<any>;
    constructor(fromClausePosition: number[], subQuery: PHRawMappedSQLQuery<any>);
    getInstance(): QView;
    getJoinRelationJson(jsonRelation: JSONViewJoinRelation, columnAliases: FieldColumnAliases): JSONViewJoinRelation;
    getRootRelationJson(jsonRelation: JSONViewJoinRelation, columnAliases: FieldColumnAliases): JSONViewJoinRelation;
}
