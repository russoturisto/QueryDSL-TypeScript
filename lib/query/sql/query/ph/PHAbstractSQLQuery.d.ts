import { PHRawMappedSQLQuery, PHJsonMappedQSLQuery } from "./PHMappedSQLQuery";
import { JSONFieldInOrderBy, IFieldInOrderBy } from "../../../../core/field/FieldInOrderBy";
import { IQOperableField } from "../../../../core/field/OperableField";
import { JSONClauseField } from "../../../../core/field/Appliable";
import { JSONBaseOperation } from "../../../../core/operation/Operation";
import { IFrom } from "../../../../core/entity/Entity";
import { JSONRelation } from "../../../../core/entity/Relation";
import { PHRawNonEntitySQLQuery, PHJsonNonEntitySqlQuery } from "./PHNonEntitySQLQuery";
/**
 * Created by Papa on 10/27/2016.
 */
export declare abstract class PHAbstractSQLQuery {
    protected isEntityQuery: boolean;
    protected getNonEntitySqlQuery(rawQuery: PHRawNonEntitySQLQuery, jsonQuery: PHJsonNonEntitySqlQuery): PHJsonNonEntitySqlQuery;
    protected fromClauseToJSON(fromClause: (IFrom | PHRawMappedSQLQuery<any>)[]): (JSONRelation | PHJsonMappedQSLQuery)[];
    protected whereClauseToJSON(whereClause: JSONBaseOperation): JSONBaseOperation;
    private convertRValue(rValue);
    protected groupByClauseToJSON(groupBy: IQOperableField<any, any, any, any, any>[]): JSONClauseField[];
    protected orderByClauseToJSON(orderBy: IFieldInOrderBy<any, any>[]): JSONFieldInOrderBy[];
    private getSubSelectInFromClause(subSelectEntity);
}
