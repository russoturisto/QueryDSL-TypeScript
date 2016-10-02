import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {IEntity, IQEntity} from "../../core/entity/Entity";
import {RelationRecord} from "../../core/entity/Relation";
import {SQLDialect} from "./SQLStringQuery";
import {PHJsonSQLDelete} from "./PHSQLDelete";
import {SQLStringNoJoinQuery} from "./SQLStringNoJoinQuery";
/**
 * Created by Papa on 10/2/2016.
 */

export class SQLStringDelete<IE extends IEntity> extends SQLStringNoJoinQuery<IE> {

	constructor(
		public phJsonDelete: PHJsonSQLDelete<IE>,
		qEntity: IQEntity,
		qEntityMap: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
	}

	toSQL(
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let joinQEntityMap: {[alias: string]: IQEntity} = {};
		let fromFragment = this.getTableFragment(this.phJsonDelete.deleteFrom);
		let whereFragment = this.getWHEREFragment(this.phJsonDelete.where, 0, joinQEntityMap, embedParameters, parameters);

		return `DELETE
FROM
${fromFragment}
WHERE
${whereFragment}`;
	}

}