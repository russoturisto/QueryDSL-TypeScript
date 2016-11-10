import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {IEntity, IQEntity} from "../../core/entity/Entity";
import {JSONEntityRelation, QRelation, EntityRelationRecord} from "../../core/entity/Relation";
import {JoinTreeNode} from "../../core/entity/JoinTreeNode";
import {SQLDialect} from "./SQLStringQuery";
/**
 * Created by Papa on 10/2/2016.
 */

export abstract class SQLStringNoJoinQuery extends SQLStringWhereBase {

	constructor(
		protected qEntity: IQEntity,
		qEntityMap: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
	}

	protected getTableFragment(
		fromRelation: JSONEntityRelation
	): string {
		if (!fromRelation) {
			throw `Expecting exactly one table in UPDATE/DELETE clause`;
		}
		if (fromRelation.relationPropertyName || fromRelation.joinType) {
			throw `Table in UPDATE/DELETE clause cannot be joined`;
		}
		let firstEntity = this.qEntityMapByAlias[QRelation.getAlias(fromRelation)];
		if (firstEntity != this.qEntity) {
			throw `Unexpected table in UPDATE/DELETE clause: ${fromRelation.entityName}, expecting: ${this.qEntity.__entityName__}`;
		}
		let fromFragment = `\t${this.getTableName(firstEntity)}`;

		return fromFragment;
	}
}