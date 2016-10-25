import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
import { IStringOperation, JSONRawStringOperation } from "../operation/StringOperation";
import { JSONSqlFunctionCall } from "./Functions";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQStringField<IQ extends IQEntity> extends IQField<IQ, string, JSONRawStringOperation<IQ>, IStringOperation<IQ>, IQStringField<IQ>> {
    like(like: string | IQStringField<IQ> | PHRawFieldSQLQuery<IQStringField<IQ>>): JSONRawStringOperation<IQ>;
}
export declare class QStringField<IQ extends IQEntity> extends QField<IQ, string, JSONRawStringOperation<IQ>, IStringOperation<IQ>, IQStringField<IQ>> implements IQStringField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    like(like: string | IQStringField<IQ> | PHRawFieldSQLQuery<IQStringField<IQ>>): JSONRawStringOperation<IQ>;
}
export declare class QStringFunction extends QStringField<any> {
    constructor();
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQStringField<any>;
    toJSON(): JSONClauseField;
}
