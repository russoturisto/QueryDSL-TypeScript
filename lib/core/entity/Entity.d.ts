/**
 * Created by Papa on 4/21/2016.
 */
import { IQRelation, JSONEntityRelation, JSONRelation, JSONJoinRelation, JSONViewJoinRelation } from "./Relation";
import { JSONBaseOperation, IOperation } from "../operation/Operation";
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
export interface IQEntity {
    __qEntityConstructor__: {
        new (...args: any[]): any;
    };
    __entityConstructor__: {
        new (): any;
    };
    __entityFieldMap__: {
        [propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>;
    };
    __entityName__: string;
    __entityRelationMap__: {
        [propertyName: string]: IQRelation<IQEntity, any>;
    };
    currentChildIndex: number;
    rootEntityPrefix: string;
    fromClausePosition: number[];
    relationPropertyName: string;
    joinType: JoinType;
    joinWhereClause: JSONBaseOperation;
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation<IQR, R>): void;
    addEntityField<IQF extends IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>>(propertyName: string, field: IQF): void;
    fields(fields: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]): IQEntity;
    getRelationJson(): JSONRelation;
}
export declare abstract class QEntity<IQ extends IQEntity> implements IQEntity, IFrom {
    __qEntityConstructor__: {
        new (...args: any[]): IQ;
    };
    __entityConstructor__: {
        new (): any;
    };
    __entityName__: string;
    rootEntityPrefix: string;
    fromClausePosition: number[];
    relationPropertyName: any;
    joinType: JoinType;
    __entityFieldMap__: {
        [propertyName: string]: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>;
    };
    __entityRelationMap__: {
        [propertyName: string]: IQRelation<IQEntity, any>;
    };
    currentChildIndex: number;
    joinWhereClause: JSONBaseOperation;
    constructor(__qEntityConstructor__: {
        new (...args: any[]): IQ;
    }, __entityConstructor__: {
        new (): any;
    }, __entityName__: string, rootEntityPrefix?: string, fromClausePosition?: number[], relationPropertyName?: any, joinType?: JoinType);
    getInstance(): IQ;
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation<IQR, R>): void;
    addEntityField<T, IQF extends IQOperableField<T, JSONBaseOperation, IOperation<T, JSONBaseOperation>, any>>(propertyName: string, field: IQF): void;
    getRelationJson(): JSONRelation;
    getJoinRelationJson(jsonRelation: JSONJoinRelation): JSONJoinRelation;
    getEntityRelationJson(jsonRelation: JSONEntityRelation): JSONEntityRelation;
    getRootRelationJson(jsonRelation: JSONRelation): JSONJoinRelation;
    getQ(): IQ;
    fields(fields: IQOperableField<any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]): IQ;
    join<IF extends IFrom>(right: IF, joinType: JoinType): JoinFields<IF>;
    fullJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    innerJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    leftJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
    rightJoin<IF extends IFrom>(right: IF): JoinFields<IF>;
}
export declare class QView extends QEntity<QView> implements IQEntity, IFrom {
    rootEntityPrefix: string;
    fromClausePosition: number[];
    subQuery: PHRawMappedSQLQuery<any>;
    constructor(rootEntityPrefix: string, fromClausePosition: number[], subQuery: PHRawMappedSQLQuery<any>);
    getInstance(): QView;
    getJoinRelationJson(jsonRelation: JSONViewJoinRelation): JSONViewJoinRelation;
    getRootRelationJson(jsonRelation: JSONViewJoinRelation): JSONViewJoinRelation;
}
