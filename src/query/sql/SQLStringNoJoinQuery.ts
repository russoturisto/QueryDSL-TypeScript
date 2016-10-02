import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {IQEntity, IEntity} from "../../core/entity/Entity";
import {JSONRelation} from "../../core/entity/Relation";
/**
 * Created by Papa on 10/2/2016.
 */

export abstract class SQLStringNoJoinQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {

	protected getTableFragment(
		fromRelation: JSONRelation
	): string {
		if (!fromRelation) {
			throw `Expecting exactly one table in FROM clause`;
		}
		if (fromRelation.relationPropertyName || fromRelation.joinType || fromRelation.parentEntityAlias) {
			throw `First table in FROM clause cannot be joined`;
		}
		let firstEntity = this.qEntityMap[fromRelation.entityName];
		if (firstEntity != this.qEntity) {
			throw `Unexpected first table in FROM clause: ${fromRelation.entityName}, expecting: ${this.qEntity.__entityName__}`;
		}
		let fromFragment = `\t${this.getTableName(firstEntity)}`;

		return fromFragment;
	}
}