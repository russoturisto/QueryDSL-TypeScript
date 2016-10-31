import { JSONRelation } from "../../../../core/entity/Relation";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
import { PHJsonMappedQSLQuery } from "../ph/PHMappedSQLQuery";
import { SQLStringQuery } from "../../SQLStringQuery";
import { PHJsonNonEntitySqlQuery } from "../ph/PHNonEntitySQLQuery";
import { JSONClauseField } from "../../../../core/field/Appliable";
/**
 * Created by Papa on 10/28/2016.
 */
export declare abstract class NonEntitySQLStringQuery<PHJQ extends PHJsonNonEntitySqlQuery> extends SQLStringQuery<PHJQ> {
    /**
     * Used in remote execution to parse the result set and to validate a join.
     */
    buildJoinTree(): void;
    addQEntityMapByAlias(sourceMap: any): void;
    buildFromJoinTree(joinRelations: (JSONRelation | PHJsonMappedQSLQuery)[], joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }): JoinTreeNode;
    getValue(rawValue: any, allowField: boolean, allowSubqueries: boolean): string;
    getFieldValue(clauseField: JSONClauseField, selectSqlFragment: string, allowNestedObjects: boolean, defaultCallback: () => string): string;
}
