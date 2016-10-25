/**
 * Created by Papa on 4/21/2016.
 */
import { IQField } from "../field/Field";
import { IQRelation, JSONEntityRelation, JSONRelation, JSONJoinRelation } from "./Relation";
import { JSONBaseOperation, IOperation } from "../operation/Operation";
import { JoinType } from "./Joins";
/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
    '*'?: null | undefined;
}
export interface IFrom {
}
export interface IQEntity {
    __qEntityConstructor__: {
        new (...args: any[]): any;
    };
    __entityConstructor__: {
        new (): any;
    };
    __entityFieldMap__: {
        [propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>;
    };
    __entityName__: string;
    __entityRelationMap__: {
        [propertyName: string]: IQRelation<IQEntity, any, IQEntity>;
    };
    currentChildIndex: number;
    rootEntityPrefix: string;
    fromClausePosition: number[];
    relationPropertyName: string;
    joinType: JoinType;
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation<IQR, R, IQEntity>): void;
    addEntityField<IQF extends IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>>(propertyName: string, field: IQF): void;
    fields(fields: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]): IQEntity;
    getRelationJson(): JSONRelation;
}
export declare abstract class QEntity<IQ extends IQEntity> implements IQEntity, IFrom {
    __qEntityConstructor__: {
        new (...args: any[]): any;
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
        [propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>;
    };
    __entityRelationMap__: {
        [propertyName: string]: IQRelation<IQEntity, any, IQEntity>;
    };
    currentChildIndex: number;
    joinWhereClause: JSONBaseOperation;
    constructor(__qEntityConstructor__: {
        new (...args: any[]): any;
    }, __entityConstructor__: {
        new (): any;
    }, __entityName__: string, rootEntityPrefix?: string, fromClausePosition?: number[], relationPropertyName?: any, joinType?: JoinType);
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<T, IQF extends IQField<IQ, T, JSONBaseOperation, IOperation<T, JSONBaseOperation>, any>>(propertyName: string, field: IQF): void;
    getRelationJson(): JSONRelation;
    getJoinRelationJson(jsonRelation: JSONJoinRelation): void;
    getEntityRelationJson(jsonRelation: JSONEntityRelation): void;
    getRootRelationJson(jsonRelation: JSONRelation): void;
    getQ(): IQ;
    fields(fields: IQField<IQ, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>, any>[]): IQ;
    abstract toJSON(): any;
}
