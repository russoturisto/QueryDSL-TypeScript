import { IQEntity } from "../entity/Entity";
import { JSONRawDateOperation, IDateOperation } from "../operation/DateOperation";
import { JSONSqlFunctionCall } from "./Functions";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField } from "./OperableField";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQDateField<IQ extends IQEntity> extends IQOperableField<IQ, Date, JSONRawDateOperation<IQ>, IDateOperation<IQ>, IQDateField<IQ>> {
    greaterThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    greaterThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
}
export declare class QDateField<IQ extends IQEntity> extends QOperableField<IQ, Date, JSONRawDateOperation<IQ>, IDateOperation<IQ>, IQDateField<IQ>> implements IQDateField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    greaterThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    greaterThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
}
export declare class QDateFunction extends QDateField<any> {
    private value;
    constructor(value?: Date);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQDateField<any>;
    toJSON(): JSONClauseField;
}
