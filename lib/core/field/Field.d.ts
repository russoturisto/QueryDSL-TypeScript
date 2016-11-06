/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IFieldInOrderBy } from "./FieldInOrderBy";
import { JSONSqlFunctionCall } from "./Functions";
import { Appliable, JSONClauseField, JSONClauseObjectType } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { FieldColumnAliases } from "../entity/Aliases";
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
    q: IQEntity;
    qConstructor: new () => IQEntity;
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    __appliedFunctions__: JSONSqlFunctionCall[];
    __fieldSubQuery__: PHRawFieldSQLQuery<IQF>;
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, fieldType: FieldType);
    protected getFieldKey(): string;
    objectEquals<QF extends QField<any>>(otherField: QF, checkValue?: boolean): boolean;
    asc(): IFieldInOrderBy<IQF>;
    desc(): IFieldInOrderBy<IQF>;
    abstract getInstance(qEntity?: IQEntity): QField<IQF>;
    protected copyFunctions<QF extends QField<IQF>>(field: QF): QF;
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQF;
    addSubQuery(subQuery: PHRawFieldSQLQuery<IQF>): IQF;
    toJSON(columnAliases?: FieldColumnAliases): JSONClauseField;
    appliedFunctionsToJson(appliedFunctions: JSONSqlFunctionCall[]): JSONSqlFunctionCall[];
    functionCallToJson(functionCall: JSONSqlFunctionCall): JSONSqlFunctionCall;
    valueToJSON(value: any): any;
    operableFunctionToJson(type: JSONClauseObjectType, value: any, columnAliases?: FieldColumnAliases): JSONClauseField;
}
