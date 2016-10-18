import {IOrderByParser, AbstractOrderByParser} from "./IOrderByParser";
import {IQEntity} from "../../../../core/entity/Entity";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will order the results exactly as specified in the Order By clause
 */
export class ExactOrderByParser extends AbstractOrderByParser implements IOrderByParser {

	getOrderByFragment(
		joinTree: JoinTreeNode,
		qEntityMapByAlias: {[alias: string]: IQEntity}
	): string {
		if (!this.orderBy) {
			return '';
		}
		return this.getCommonOrderByFragment(qEntityMapByAlias, this.orderBy);
	}

}