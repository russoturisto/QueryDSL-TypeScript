import { PHRawMappedSQLQuery } from "./PHMappedSQLQuery";
import { JSONFieldInOrderBy, IFieldInOrderBy, JSONFieldInGroupBy } from "../../../../core/field/FieldInOrderBy";
import { IQOperableField } from "../../../../core/field/OperableField";
import { JSONBaseOperation } from "../../../../core/operation/Operation";
import { IFrom } from "../../../../core/entity/Entity";
import { JSONRelation } from "../../../../core/entity/Relation";
import { PHRawNonEntitySQLQuery, PHJsonNonEntitySqlQuery } from "./PHNonEntitySQLQuery";
import { FieldColumnAliases } from "../../../../core/entity/Aliases";
/**
 * Created by Papa on 10/27/2016.
 */
export declare abstract class PHAbstractSQLQuery {
    protected isEntityQuery: boolean;
    protected columnAliases: FieldColumnAliases;
    protected getNonEntitySqlQuery(rawQuery: PHRawNonEntitySQLQuery, jsonQuery: PHJsonNonEntitySqlQuery): PHJsonNonEntitySqlQuery;
    protected fromClauseToJSON(fromClause: (IFrom | PHRawMappedSQLQuery<any>)[]): JSONRelation[];
    static whereClauseToJSON(whereClause: JSONBaseOperation): JSONBaseOperation;
    private static convertLRValue(rValue);
    protected groupByClauseToJSON(groupBy: IQOperableField<any, any, any, any>[]): JSONFieldInGroupBy[];
    protected orderByClauseToJSON(orderBy: IFieldInOrderBy<any>[]): JSONFieldInOrderBy[];
}
