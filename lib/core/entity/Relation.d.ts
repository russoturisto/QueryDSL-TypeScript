import { IQEntity } from "./Entity";
import { JoinType } from "../../query/sql/PHSQLQuery";
export declare class ColumnAliases {
    numFields: number;
    private lastAlias;
    private columnAliasMap;
    addAlias(tableAlias: string, propertyName: string): string;
    getAlias(tableAlias: string, propertyName: string): string;
    private getAliasKey(tableAlias, propertyName);
    private getNextAlias();
}
export declare class JoinTreeNode {
    jsonRelation: JSONRelation;
    childNodes: JoinTreeNode[];
    constructor(jsonRelation: JSONRelation, childNodes: JoinTreeNode[]);
    addChildNode(joinTreeNode: JoinTreeNode): void;
    getChildNode(entityName: string, relationName: string): JoinTreeNode;
}
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
export declare const INNER_JOIN: string;
export declare const LEFT_JOIN: string;
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
export declare const IS_ENTITY_PROPERTY_NAME: string;
export declare class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    relationType: RelationType;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    static isStub(object: any): boolean;
    static markAsEntity(object: any): void;
    static getPositionAlias(fromClausePosition: number[]): string;
    static getAlias(jsonRelation: JSONRelation): string;
    static getParentAlias(jsonRelation: JSONRelation): string;
    constructor(q: IQ, qConstructor: new () => IQ, relationType: RelationType, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
}
