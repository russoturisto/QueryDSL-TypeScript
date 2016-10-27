import { IQEntity } from "../entity/Entity";
import { JSONRawNumberOperation, INumberOperation } from "../operation/NumberOperation";
import { JSONSqlFunctionCall } from "./Functions";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField } from "./OperableField";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQNumberField<IQ extends IQEntity> extends IQOperableField<IQ, number, JSONRawNumberOperation<IQ>, INumberOperation<IQ>, IQNumberField<IQ>> {
    greaterThan(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
    greaterThanOrEquals(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
    lessThan(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
    lessThanOrEquals(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
}
export declare class QNumberField<IQ extends IQEntity> extends QOperableField<IQ, number, JSONRawNumberOperation<IQ>, INumberOperation<IQ>, IQNumberField<IQ>> implements IQNumberField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    greaterThan(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
    greaterThanOrEquals(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
    lessThan(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
    lessThanOrEquals(value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>): JSONRawNumberOperation<IQ>;
}
export declare class QNumberFunction extends QNumberField<any> {
    private value;
    constructor(value?: number);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQNumberField<any>;
    toJSON(): JSONClauseField;
}
