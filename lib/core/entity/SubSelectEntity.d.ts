import { IQEntity, QEntity } from "./Entity";
import { JoinType, PHRawNonEntitySQLQuery } from "../../query/sql/PHSQLQuery";
import { IQNumberField } from "../field/NumberField";
import { IQBooleanField } from "../field/BooleanField";
import { IQDateField } from "../field/DateField";
import { IQStringField } from "../field/StringField";
import { JSONBaseOperation } from "../operation/Operation";
/**
 * Created by Papa on 10/22/2016.
 */
export interface JSONSubQueryOperation extends JSONBaseOperation {
    operator: "$exists";
    query: PHRawNonEntitySQLQuery;
}
export interface ISubSelectQEntity extends IQEntity {
}
export declare class SubSelectEntity {
}
export declare const SUB_SELECT_ENTITY_NAME: string;
export declare class SubSelectQEntity extends QEntity<any> implements ISubSelectQEntity {
    rootEntityPrefix: string;
    fromClausePosition: number[];
    relationPropertyName: any;
    joinType: JoinType;
    constructor(rootEntityPrefix?: string, fromClausePosition?: number[], relationPropertyName?: any, joinType?: JoinType);
    numberField(fieldName: string): IQNumberField<SubSelectQEntity>;
    booleanField(fieldName: string): IQBooleanField<SubSelectQEntity>;
    dateField(fieldName: string): IQDateField<SubSelectQEntity>;
    stringField(fieldName: string): IQStringField<SubSelectQEntity>;
    toJSON(): any;
}
