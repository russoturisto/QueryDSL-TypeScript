import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {IEntity} from "../../core/entity/Entity";
import {JSONEntityRelation, QRelation} from "../../core/entity/Relation";
import {JoinTreeNode} from "../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/2/2016.
 */

export abstract class SQLStringNoJoinQuery extends SQLStringWhereBase {

	getJoinNodeMap(): {[alias: string]: JoinTreeNode} {
		let rootRelation: JSONEntityRelation = {
			fromClausePosition: [],
			entityName: this.rootQEntity.__entityName__,
			joinType: null,
			relationPropertyName: null
		};
		let jsonRootNode = new JoinTreeNode(rootRelation, [], null);
		let alias = QRelation.getAlias(rootRelation);
		this.qEntityMapByAlias[alias] = this.rootQEntity;
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		joinNodeMap[alias] = jsonRootNode;

		return joinNodeMap;
	}

	protected getTableFragment(
		fromRelation: JSONEntityRelation
	): string {
		if (!fromRelation) {
			throw `Expecting exactly one table in FROM clause`;
		}
		if (fromRelation.relationPropertyName || fromRelation.joinType) {
			throw `First table in FROM clause cannot be joined`;
		}
		let firstEntity = this.qEntityMapByAlias[QRelation.getAlias(fromRelation)];
		if (firstEntity != this.rootQEntity) {
			throw `Unexpected first table in FROM clause: ${fromRelation.entityName}, expecting: ${this.rootQEntity.__entityName__}`;
		}
		let fromFragment = `\t${this.getTableName(firstEntity)}`;

		return fromFragment;
	}
}