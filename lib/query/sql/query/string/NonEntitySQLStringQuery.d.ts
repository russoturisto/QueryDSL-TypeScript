import { JSONRelation } from "../../../../core/entity/Relation";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
import { PHJsonMappedQSLQuery } from "../ph/PHMappedSQLQuery";
import { SQLStringQuery } from "../../SQLStringQuery";
import { PHJsonNonEntitySqlQuery } from "../ph/PHNonEntitySQLQuery";
import { JSONClauseField } from "../../../../core/field/Appliable";
import { FieldColumnAliases } from "../../../../core/entity/Aliases";
/**
 * Created by Papa on 10/28/2016.
 */
export declare abstract class NonEntitySQLStringQuery<PHJQ extends PHJsonNonEntitySqlQuery> extends SQLStringQuery<PHJQ> {
    protected columnAliases: FieldColumnAliases;
    protected joinTrees: JoinTreeNode[];
    /**
     * Used in remote execution to parse the result set and to validate a join.
     */
    buildJoinTree(): void;
    addQEntityMapByAlias(sourceMap: any): void;
    buildFromJoinTree(joinRelations: (JSONRelation | PHJsonMappedQSLQuery)[], joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }): JoinTreeNode[];
    getFunctionCallValue(rawValue: any): string;
    getFieldValue(clauseField: JSONClauseField, allowNestedObjects: boolean, defaultCallback: () => string): string;
    private getFROMFragment(parentTree, currentTree, embedParameters?, parameters?);
}
