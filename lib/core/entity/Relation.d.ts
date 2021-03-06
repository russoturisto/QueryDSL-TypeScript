import { IQEntity } from "./Entity";
import { JSONBaseOperation } from "../operation/Operation";
import { JoinType } from "./Joins";
import { PHJsonMappedQSLQuery } from "../../query/sql/query/ph/PHMappedSQLQuery";
/**
 * Created by Papa on 4/26/2016.
 */
export interface EntityRelationRecord {
    entityName: string;
    propertyName: string;
    relationType: EntityRelationType;
}
export declare enum EntityRelationType {
    ONE_TO_MANY = 0,
    MANY_TO_ONE = 1,
}
export declare enum JSONRelationType {
    ENTITY_JOIN_ON = 0,
    ENTITY_SCHEMA_RELATION = 1,
    ENTITY_ROOT = 2,
    SUB_QUERY_JOIN_ON = 3,
    SUB_QUERY_ROOT = 4,
}
export interface JSONRelation {
    currentChildIndex: number;
    entityName?: string;
    fromClausePosition: number[];
    joinType: JoinType;
    relationType: JSONRelationType;
    rootEntityPrefix: string;
}
export interface JSONJoinRelation extends JSONRelation {
    joinWhereClause?: JSONBaseOperation;
}
export interface JSONViewJoinRelation extends JSONJoinRelation {
    subQuery: PHJsonMappedQSLQuery;
}
export interface JSONEntityRelation extends JSONRelation {
    relationPropertyName: string;
}
export interface IQRelation {
    innerJoin(): any;
    leftJoin(): any;
}
export declare abstract class QRelation {
    static getPositionAlias(rootEntityPrefix: string, fromClausePosition: number[]): string;
    static getAlias(jsonRelation: JSONRelation): string;
    static getParentAlias(jsonRelation: JSONRelation): string;
    static createRelatedQEntity<IQ extends IQEntity>(joinRelation: JSONRelation, entityMapByName: {
        [entityName: string]: IQEntity;
    }): IQ;
    static getNextChildJoinPosition(joinParent: IQEntity): number[];
}
