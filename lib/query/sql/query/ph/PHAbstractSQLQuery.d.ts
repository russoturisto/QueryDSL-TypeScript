import { JSONFieldInOrderBy, IFieldInOrderBy } from "../../../../core/field/FieldInOrderBy";
import { IQOperableField } from "../../../../core/field/OperableField";
import { JSONClauseField } from "../../../../core/field/Appliable";
import { JSONBaseOperation } from "../../../../core/operation/Operation";
import { PHRawNonEntitySQLQuery } from "./PHNonEntitySQLQuery";
import { PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery } from "../../PHSQLQuery";
/**
 * Created by Papa on 10/27/2016.
 */
export declare abstract class PHAbstractSQLQuery {
    protected getNonEntitySqlQuery(rawQuery: PHRawNonEntitySQLQuery, jsonQuery: PHJsonCommonNonEntitySQLQuery & PHJsonGroupedSQLQuery): PHJsonCommonNonEntitySQLQuery & PHJsonGroupedSQLQuery;
    private fromClauseToJSON(fromClause);
    protected whereClauseToJSON(whereClause: JSONBaseOperation): JSONBaseOperation;
    private convertRValue(rValue);
    protected groupByClauseToJSON(groupBy: IQOperableField<any, any, any, any, any>[]): JSONClauseField[];
    protected orderByClauseToJSON(orderBy: IFieldInOrderBy<any, any>[]): JSONFieldInOrderBy[];
    private getSubSelectInFromClause(subSelectEntity);
}
