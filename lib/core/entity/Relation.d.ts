import { IQEntity, IFrom, IJoinParent } from "./Entity";
import { JSONBaseOperation } from "../operation/Operation";
import { PHRawMappedSQLQuery } from "../../query/sql/query/ph/PHMappedSQLQuery";
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
export declare enum JoinType {
    FULL_JOIN = 0,
    INNER_JOIN = 1,
    LEFT_JOIN = 2,
    RIGHT_JOIN = 3,
}
export interface JSONRelation {
    rootEntityName: string;
    fromClausePosition: number[];
    entityName: string;
    joinType: JoinType;
    relationPropertyName: string;
}
export interface IQRelation<IQR extends IQEntity, R, IQ extends IQEntity> {
    relationType: RelationType;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new () => IQR;
    innerJoin(): any;
    leftJoin(): any;
}
export declare const IS_ENTITY_PROPERTY_NAME: string;
export declare abstract class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    relationType: RelationType;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    static getPositionAlias(rootEntityName: string, fromClausePosition: number[]): string;
    static getAlias(jsonRelation: JSONRelation): string;
    static getParentAlias(jsonRelation: JSONRelation): string;
    constructor(q: IQ, qConstructor: new () => IQ, relationType: RelationType, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
    static createRelatedQEntity<IQ extends IQEntity>(joinRelation: JSONRelation, entityMapByName: {
        [entityName: string]: IQEntity;
    }): IQ;
    static getNextChildJoinPosition(joinParent: IJoinParent): number[];
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
export interface JoinOperation<IF extends IFrom, EMap> {
    (entity: IF | EMap): JSONBaseOperation;
}
export declare class JoinFields<IF extends IFrom, EMap> {
    private joinTo;
    constructor(joinTo: IF | PHRawMappedSQLQuery<EMap>);
    on(joinOperation: JoinOperation<IF, EMap>): IF | EMap;
}
export declare function fullJoin<IF extends IFrom, EMap>(left: IF | PHRawMappedSQLQuery<EMap>, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
export declare function innerJoin<IF extends IFrom, EMap>(left: IF | PHRawMappedSQLQuery<EMap>, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
export declare function leftJoin<IF extends IFrom, EMap>(left: IF | PHRawMappedSQLQuery<EMap>, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
export declare function rightJoin<IF extends IFrom, EMap>(left: IF | PHRawMappedSQLQuery<EMap>, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
