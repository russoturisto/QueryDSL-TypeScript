/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IFieldInOrderBy } from "./FieldInOrderBy";
import { JSONSqlFunctionCall } from "./Functions";
import { Appliable, JSONClauseField, JSONClauseObjectType, SQLDataType } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { FieldColumnAliases } from "../entity/Aliases";
import { IQFunction } from "./OperableField";
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
    objectType: JSONClauseObjectType;
    dataType: SQLDataType;
    __appliedFunctions__: JSONSqlFunctionCall[];
    __fieldSubQuery__: PHRawFieldSQLQuery<IQF>;
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, objectType: JSONClauseObjectType, dataType: SQLDataType);
    /**
     protected getFieldKey() {
        let rootEntityPrefix = columnAliases.entityAliases.getExistingAlias(this.q.getRootJoinEntity());
        let key = `${QRelation.getPositionAlias(rootEntityPrefix, this.q.fromClausePosition)}.${this.fieldName}`;

        return key;
    }
     */
    asc(): IFieldInOrderBy<IQF>;
    desc(): IFieldInOrderBy<IQF>;
    abstract getInstance(qEntity?: IQEntity): QField<IQF>;
    protected copyFunctions<QF extends QField<IQF>>(field: QF): QF;
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQF;
    addSubQuery(subQuery: PHRawFieldSQLQuery<IQF>): IQF;
    toJSON(columnAliases: FieldColumnAliases, forSelectClause: boolean): JSONClauseField;
    private appliedFunctionsToJson(appliedFunctions, columnAliases);
    private functionCallToJson(functionCall, columnAliases);
    private valueToJSON(functionObject, columnAliases, forSelectClause);
    operableFunctionToJson(functionObject: IQFunction<any>, columnAliases: FieldColumnAliases, forSelectClause: boolean): JSONClauseField;
}
