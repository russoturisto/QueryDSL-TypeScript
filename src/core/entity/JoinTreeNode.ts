import {JSONRelation, JSONEntityRelation, JSONRelationType} from "./Relation";
import {JoinType} from "./Joins";
/**
 * Created by Papa on 10/18/2016.
 */

export class JoinTreeNode {

	constructor(
		public jsonRelation: JSONRelation,
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

	getEntityRelationChildNode(
		entityName: string,
		relationName: string
	): JoinTreeNode {
		let matchingNodes = this.childNodes.filter(( childNode ) => {
			return (<JSONEntityRelation>childNode.jsonRelation).relationPropertyName === relationName;
		});
		switch (matchingNodes.length) {
			case 0:
				break;
			case 1:
				return matchingNodes[0];
			default:
				throw `More than one child node matched relation property name '${relationName}'`;
		}
		// No node matched, this must be reference to a sub-entity in select clause (in a Entity query)
		let childPosition = this.jsonRelation.fromClausePosition.slice();
		childPosition.push(this.childNodes.length);
		let jsonEntityRelation:JSONEntityRelation = {
			currentChildIndex: 0,
			fromClausePosition: childPosition,
			entityName: entityName,
			joinType: JoinType.LEFT_JOIN,
			relationType: JSONRelationType.ENTITY_SCHEMA_RELATION,
			rootEntityPrefix: this.parentNode.jsonRelation.rootEntityPrefix,
			relationPropertyName: relationName
		};
		let childTreeNode = new JoinTreeNode(jsonEntityRelation, [], this);
		this.addChildNode(childTreeNode);

		return childTreeNode;
	}
}