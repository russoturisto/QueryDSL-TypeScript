import { IQEntity } from "./Entity";
import { JoinType } from "../../query/sql/PHSQLQuery";
import { Orderable } from "../field/Field";
import { JSONFieldInOrderBy } from "../field/FieldInOrderBy";
/**
 * Created by Papa on 4/26/2016.
 */
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
    fromClausePosition: number[];
    entityName: string;
    joinType: JoinType;
    relationPropertyName: string;
}
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
export interface IQManyToOneRelation<IQR extends IQEntity, R, IQ extends IQEntity> extends IQRelation<IQR, R, IQ>, Orderable<IQ> {
}
export declare const IS_ENTITY_PROPERTY_NAME = ".isEntity";
export declare abstract class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    relationType: RelationType;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    static getPositionAlias(fromClausePosition: number[]): string;
    static getAlias(jsonRelation: JSONRelation): string;
    static getParentAlias(jsonRelation: JSONRelation): string;
    constructor(q: IQ, qConstructor: new () => IQ, relationType: RelationType, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
    static createRelatedQEntity<IQ extends IQEntity>(joinRelation: JSONRelation, entityMapByName: {
        [entityName: string]: IQEntity;
    }): IQ;
}
export declare class QManyToOneRelation<IQR extends IQEntity, R, IQ extends IQEntity> extends QRelation<IQR, R, IQ> implements IQManyToOneRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    readonly fieldName: string;
    asc(): JSONFieldInOrderBy;
    desc(): JSONFieldInOrderBy;
}
export declare class QOneToManyRelation<IQR extends IQEntity, R, IQ extends IQEntity> extends QRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
}
