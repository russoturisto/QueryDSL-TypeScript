/**
 * Created by Papa on 10/16/2016.
 */
import {IEntity, IQEntity} from "../../../core/entity/Entity";
import {SQLStringQuery, SQLDialect, QueryResultType} from "../SQLStringQuery";
import {JSONFieldInOrderBy} from "../../../core/field/FieldInOrderBy";
import {EntityRelationRecord} from "../../../core/entity/Relation";
/**
 * Represents SQL String query with flat (aka traditional) Select clause.
 */
export class FlatSQLStringQuery<IE extends IEntity> extends SQLStringQuery<IE> {

	constructor(
		phJsonQuery: PHJsonSQLQuery<IE>,
		qEntity: IQEntity,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(phJsonQuery, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, QueryResultType.FLAT);
	}

	protected getSELECTFragment(
		entityName: string,
		selectSqlFragment: string,
		selectClauseFragment: any,
		joinTree: JoinTreeNode,
		entityDefaults: EntityDefaults,
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		return selectSqlFragment;
	}

	protected getOrderByFragment(
		orderBy?: JSONFieldInOrderBy[]
	): string {
		return this.orderByParser.getOrderByFragment(this.joinTree, this.qEntityMapByAlias);
	}

}