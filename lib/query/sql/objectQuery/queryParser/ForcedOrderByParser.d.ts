import { JSONFieldInOrderBy } from "../../../../core/field/FieldInOrderBy";
import { IOrderByParser, AbstractOrderByParser } from "./IOrderByParser";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityMetadata } from "../../../../core/entity/EntityMetadata";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will hierarchically order the results of the query using breadth-first procesing. Within a given entity will take
 * into account the sort order specified in the Order By clause.
 */
export declare class ForcedOrderByParser extends AbstractOrderByParser implements IOrderByParser {
    /**
     * Using the following algorithm
     * http://stackoverflow.com/questions/2549541/performing-breadth-first-search-recursively
     * :
     BinarySearchTree.prototype.breadthFirst = function() {
      var result = '',
      queue = [],
      current = this.root;

      if (!current) return null;
      queue.push(current);

      while (current = queue.shift()) {
            result += current.value + ' ';
            current.left && queue.push(current.left);
            current.right && queue.push(current.right);
        }
      return result;
     }
     *
     * @param joinTree
     * @param qEntityMapByAlias
     * @returns {string}
     */
    getOrderByFragment(joinTree: JoinTreeNode, qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
    buildOrderByFragmentForEntity(tableAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, propertyNamesToSortBy: string[], manyToOneRelationNamesToSortBy: string[], idColumnToSortBy: string, currentEntityOrderBy: JSONFieldInOrderBy[], qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
    isForParentNode(joinTreeNode: JoinTreeNode, orderByField: JSONFieldInOrderBy): boolean;
}
