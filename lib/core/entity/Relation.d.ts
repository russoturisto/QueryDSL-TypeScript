import { IQEntity } from "./Entity";
import { JoinType } from "../../query/sql/PHSQLQuery";
export interface RelationRecord {
    entityName: string;
    propertyName: string;
    relationType: RelationType;
}
export declare enum RelationType {
    ONE_TO_MANY = 0,
    MANY_TO_ONE = 1,
}
export interface JSONRelation {
    alias: string;
    entityName: string;
    joinType: JoinType;
    parentEntityAlias: string;
    relationPropertyName: string;
}
export declare const INNER_JOIN = "INNER_JOIN";
export declare const LEFT_JOIN = "LEFT_JOIN";
export interface IQRelation<IQR extends IQEntity, R, IQ extends IQEntity> {
    entityName: string;
    q: IQ;
    qConstructor: new () => IQ;
    propertyName: string;
    relationType: RelationType;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new () => IQR;
    innerJoin(): any;
    leftJoin(): any;
}
export declare class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    relationType: RelationType;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    constructor(q: IQ, qConstructor: new () => IQ, relationType: RelationType, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
}
