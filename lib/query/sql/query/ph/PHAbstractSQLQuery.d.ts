import { PHRawMappedSQLQuery } from "./PHMappedSQLQuery";
import { JSONFieldInOrderBy, IFieldInOrderBy, JSONFieldInGroupBy } from "../../../../core/field/FieldInOrderBy";
import { IQOperableField } from "../../../../core/field/OperableField";
import { JSONBaseOperation } from "../../../../core/operation/Operation";
import { IFrom, IEntityRelationFrom } from "../../../../core/entity/Entity";
import { JSONRelation } from "../../../../core/entity/Relation";
import { PHRawNonEntitySQLQuery, PHJsonNonEntitySqlQuery } from "./PHNonEntitySQLQuery";
import { FieldColumnAliases, EntityAliases } from "../../../../core/entity/Aliases";
/**
 * Created by Papa on 10/27/2016.
 */
export declare abstract class PHAbstractSQLQuery {
    protected entityAliases: EntityAliases;
    protected columnAliases: FieldColumnAliases;
    protected isEntityQuery: boolean;
    constructor(entityAliases?: EntityAliases, columnAliases?: FieldColumnAliases);
    protected getNonEntitySqlQuery(rawQuery: PHRawNonEntitySQLQuery, jsonQuery: PHJsonNonEntitySqlQuery): PHJsonNonEntitySqlQuery;
    protected fromClauseToJSON(fromClause: (IFrom | IEntityRelationFrom | PHRawMappedSQLQuery<any>)[]): JSONRelation[];
    static whereClauseToJSON(whereClause: JSONBaseOperation, columnAliases: FieldColumnAliases): JSONBaseOperation;
    private static convertLRValue(rValue, columnAliases);
    protected groupByClauseToJSON(groupBy: IQOperableField<any, any, any, any>[]): JSONFieldInGroupBy[];
    protected orderByClauseToJSON(orderBy: IFieldInOrderBy<any>[]): JSONFieldInOrderBy[];
}
