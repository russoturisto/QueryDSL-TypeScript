import {QEntity} from "../../core/entity/Entity";
import {JSONEntityRelation} from "../../core/entity/Relation";
/**
 * Created by Papa on 8/23/2016.
 */

export enum RelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export class QueryTreeNode {

	children: QueryTreeNode[] = [];

	constructor(
		public qEntity:QEntity<any>,
	  public relationToParent:JSONEntityRelation,
	  public relationToParentType:RelationType
	) {
	}

}