import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
import { JSONRawDateOperation, IDateOperation } from "../operation/DateOperation";
import { PHRawFieldSQLQuery } from "../../query/sql/PHSQLQuery";
import { JSONSqlFunctionCall } from "./Functions";
import { JSONClauseField } from "./Appliable";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQDateField<IQ extends IQEntity> extends IQField<IQ, Date, JSONRawDateOperation<IQ>, IDateOperation<IQ>, IQDateField<IQ>> {
    greaterThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    greaterThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
}
export declare class QDateField<IQ extends IQEntity> extends QField<IQ, Date, JSONRawDateOperation<IQ>, IDateOperation<IQ>, IQDateField<IQ>> implements IQDateField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    greaterThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    greaterThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThan(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
    lessThanOrEquals(value: Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>): JSONRawDateOperation<IQ>;
}
export declare class QDateFunction extends QDateField<any> {
    constructor();
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQDateField<any>;
    toJSON(): JSONClauseField;
}
