import {IEntity, IQEntity} from "../../core/entity/Entity";
import {EntityRelationRecord} from "../../core/entity/Relation";
import {SQLDialect} from "./SQLStringQuery";
import {PHJsonSQLDelete} from "./PHSQLDelete";
import {SQLStringNoJoinQuery} from "./SQLStringNoJoinQuery";
/**
 * Created by Papa on 10/2/2016.
 */

export class SQLStringDelete extends SQLStringNoJoinQuery {

	constructor(
		public phJsonDelete: PHJsonSQLDelete,
		qEntity: IQEntity,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
	}

	toSQL(
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let fromFragment = this.getTableFragment(this.phJsonDelete.deleteFrom);
		let whereFragment = '';
		let jsonQuery = this.phJsonDelete;
		if (jsonQuery.where) {
			whereFragment = `
WHERE
${this.getWHEREFragment(jsonQuery.where, '')}`;
		}

		return `DELETE
FROM
${fromFragment}${whereFragment}`;
	}

}