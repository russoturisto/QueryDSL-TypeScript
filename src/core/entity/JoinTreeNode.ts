import {JSONEntityRelation} from "./Relation";
import {JoinType} from "./Joins";
/**
 * Created by Papa on 10/18/2016.
 */

export class JoinTreeNode {
	constructor(
		public jsonRelation: JSONEntityRelation,
		public childNodes: JoinTreeNode[],
		public parentNode: JoinTreeNode
	) {
	}

	addChildNode(
		joinTreeNode: JoinTreeNode
	): void {
		let childPositionArray = joinTreeNode.jsonRelation.fromClausePosition;
		let childPosition = childPositionArray[childPositionArray.length - 1];
		this.childNodes[childPosition] = joinTreeNode;
	}

	getChildNode(
		entityName: string,
		relationName: string
	): JoinTreeNode {
		let matchingNodes = this.childNodes.filter(( childNode ) => {
			return childNode.jsonRelation.relationPropertyName === relationName;
		});
		switch (matchingNodes.length) {
			case 0:
				break;
			case 1:
				return matchingNodes[0];
			default:
				throw `More than one child node matched relation property name '${relationName}'`;
		}
		let childPosition = this.jsonRelation.fromClausePosition.slice();
		childPosition.push(this.childNodes.length);
		let childTreeNode = new JoinTreeNode({
			fromClausePosition: childPosition,
			entityName: entityName,
			joinType: JoinType.LEFT_JOIN,
			relationPropertyName: relationName
		}, [], this);
		this.addChildNode(childTreeNode);

		return childTreeNode;
	}
}