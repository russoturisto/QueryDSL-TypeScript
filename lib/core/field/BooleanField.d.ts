import { JSONRawBooleanOperation, IBooleanOperation } from "../operation/BooleanOperation";
import { IQEntity } from "../entity/Entity";
import { IQOperableField, QOperableField, IQFunction } from "./OperableField";
import { JSONClauseObjectType, JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { FieldColumnAliases } from "../entity/Aliases";
/**
 * Created by Papa on 8/10/2016.
 */
export interface IQBooleanField extends IQOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> {
}
export declare class QBooleanField extends QOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> implements IQBooleanField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, objectType?: JSONClauseObjectType);
    getInstance(qEntity?: IQEntity): QBooleanField;
}
export declare class QBooleanFunction extends QBooleanField implements IQFunction<boolean | PHRawFieldSQLQuery<any>> {
    value: boolean | PHRawFieldSQLQuery<QBooleanField>;
    private isQueryParameter;
    parameterAlias: string;
    constructor(value: boolean | PHRawFieldSQLQuery<QBooleanField>, isQueryParameter?: boolean);
    getInstance(): QBooleanFunction;
    toJSON(columnAliases: FieldColumnAliases, forSelectClause: boolean): JSONClauseField;
}
