/**
 * Created by Papa on 4/21/2016.
 */
import { IQField } from "../field/Field";
import { IQRelation, JSONRelation } from "./Relation";
import { JoinType } from "../../query/sql/PHSQLQuery";
import { JSONBaseOperation, IOperation } from "../operation/Operation";
/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
    '*'?: null | undefined;
}
export interface IQEntity {
    __qEntityConstructor__: {
        new (...args: any[]): any;
    };
    __entityConstructor__: {
        new (): any;
    };
    __entityFieldMap__: {
        [propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>;
    };
    __entityName__: string;
    __entityRelationMap__: {
        [propertyName: string]: IQRelation<IQEntity, any, IQEntity>;
    };
    fromClausePosition: number[];
    joinType: JoinType;
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation<IQR, R, IQEntity>): void;
    addEntityField<IQF extends IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>>(propertyName: string, field: IQF): void;
    fields(fields: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>[]): IQEntity;
    getRelationJson(): JSONRelation;
    getNextChildJoinPosition(): number[];
}
export declare abstract class QEntity<IQ extends IQEntity> implements IQEntity {
    __qEntityConstructor__: {
        new (...args: any[]): any;
    };
    __entityConstructor__: {
        new (): any;
    };
    __entityName__: string;
    fromClausePosition: number[];
    relationPropertyName: any;
    joinType: JoinType;
    __entityFieldMap__: {
        [propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>;
    };
    __entityRelationMap__: {
        [propertyName: string]: IQRelation<IQEntity, any, IQEntity>;
    };
    private currentChildIndex;
    constructor(__qEntityConstructor__: {
        new (...args: any[]): any;
    }, __entityConstructor__: {
        new (): any;
    }, __entityName__: string, fromClausePosition: number[], relationPropertyName?: any, joinType?: JoinType);
    addEntityRelation<IQR extends IQEntity, R>(propertyName: string, relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<T, IQF extends IQField<IQ, T, JSONBaseOperation, IOperation<T, JSONBaseOperation>>>(propertyName: string, field: IQF): void;
    getRelationJson(): JSONRelation;
    getQ(): IQ;
    fields(fields: IQField<IQ, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>[]): IQ;
    getNextChildJoinPosition(): number[];
    abstract toJSON(): any;
}
