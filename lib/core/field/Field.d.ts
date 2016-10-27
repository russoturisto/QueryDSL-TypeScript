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
export interface Orderable<IQ extends IQEntity, IQF extends IQField<IQ, any>> {
    asc(): IFieldInOrderBy<IQ, IQF>;
    desc(): IFieldInOrderBy<IQ, IQF>;
}
export interface IQField<IQ extends IQEntity, IQF extends IQField<IQ, any>> extends Orderable<IQ, IQF> {
}
export declare abstract class QField<IQ extends IQEntity, IQF extends IQField<any, any>> implements IQField<IQ, IQF>, Appliable<JSONClauseField, IQ, IQF> {
    childConstructor: new (...args: any[]) => IQField<IQ, IQF>;
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    __appliedFunctions__: JSONSqlFunctionCall[];
    __subQuery__: PHRawFieldSQLQuery<IQF>;
    constructor(childConstructor: new (...args: any[]) => IQField<IQ, IQF>, q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, fieldType: FieldType);
    protected getFieldKey(): string;
    objectEquals<QF extends QField<any, any>>(otherField: QF, checkValue?: boolean): boolean;
    asc(): IFieldInOrderBy<IQ, IQF>;
    desc(): IFieldInOrderBy<IQ, IQF>;
    getInstance(): QField<IQ, IQF>;
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQF;
    addSubQuery(subQuery: PHRawFieldSQLQuery<IQF>): IQF;
    toJSON(): JSONClauseField;
}
