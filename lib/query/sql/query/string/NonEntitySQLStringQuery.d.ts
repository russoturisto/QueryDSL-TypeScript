import { JSONRelation, JSONViewJoinRelation } from "../../../../core/entity/Relation";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
import { SQLStringQuery } from "../../SQLStringQuery";
import { PHJsonNonEntitySqlQuery } from "../ph/PHNonEntitySQLQuery";
import { JSONClauseField } from "../../../../core/field/Appliable";
import { FieldColumnAliases } from "../../../../core/entity/Aliases";
import { QView } from "../../../../core/entity/Entity";
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
    buildFromJoinTree(joinRelations: JSONRelation[], joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }): JoinTreeNode[];
    addFieldsToView(viewJoinRelation: JSONViewJoinRelation, viewAlias: string): QView;
    /**
     * Just build the shell fields for the external API of the view, don't do anything else.
     * @param view
     * @param select
     * @param fieldPrefix
     */
    addFieldsToViewForSelect(view: QView, viewAlias: string, select: any, fieldPrefix: string, forFieldQueryAlias?: string): void;
    addFieldToViewForSelect(view: QView, viewAlias: string, fieldPrefix: string, fieldJson: JSONClauseField, alias: string, forFieldQueryAlias?: string): boolean;
    getFunctionCallValue(rawValue: any): string;
    getFieldValue(clauseField: JSONClauseField, allowNestedObjects: boolean, defaultCallback: () => string): string;
    private getFROMFragment(parentTree, currentTree, embedParameters?, parameters?);
}
