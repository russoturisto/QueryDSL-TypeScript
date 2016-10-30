/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IFieldInOrderBy } from "./FieldInOrderBy";
import { JSONSqlFunctionCall } from "./Functions";
import { Appliable, JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
export declare enum FieldType {
    BOOLEAN = 0,
    DATE = 1,
    NUMBER = 2,
    STRING = 3,
}
export interface Orderable<IQF extends IQField<IQF>> {
    asc(): IFieldInOrderBy<IQF>;
    desc(): IFieldInOrderBy<IQF>;
}
export interface IQField<IQF extends IQField<IQF>> extends Orderable<IQF> {
}
export declare abstract class QField<IQF extends IQField<IQF>> implements IQField<IQF>, Appliable<JSONClauseField, IQF> {
    childConstructor: new (...args: any[]) => IQField<IQF>;
    q: IQEntity;
    qConstructor: new () => IQEntity;
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    __appliedFunctions__: JSONSqlFunctionCall[];
    __subQuery__: PHRawFieldSQLQuery<IQF>;
    constructor(childConstructor: new (...args: any[]) => IQField<IQF>, q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, fieldType: FieldType);
    protected getFieldKey(): string;
    objectEquals<QF extends QField<any>>(otherField: QF, checkValue?: boolean): boolean;
    asc(): IFieldInOrderBy<IQF>;
    desc(): IFieldInOrderBy<IQF>;
    getInstance(): QField<IQF>;
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQF;
    addSubQuery(subQuery: PHRawFieldSQLQuery<IQF>): IQF;
    toJSON(): JSONClauseField;
}
