/**
 * Created by Papa on 10/16/2016.
 */
import {IEntity, IQEntity} from "../../../../core/entity/Entity";
import {SQLStringQuery, SQLDialect, QueryResultType} from "../../SQLStringQuery";
import {JSONFieldInOrderBy} from "../../../../core/field/FieldInOrderBy";
import {EntityRelationRecord} from "../../../../core/entity/Relation";
import {PHJsonFlatQSLQuery} from "../ph/PHFlatSQLQuery";
import {NonEntitySQLStringQuery} from "./NonEntitySQLStringQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {ClauseType} from "../../SQLStringWhereBase";
import {ExactOrderByParser} from "../orderBy/ExactOrderByParser";
/**
 * Represents SQL String query with flat (aka traditional) Select clause.
 */
export class FlatSQLStringQuery extends NonEntitySQLStringQuery<PHJsonFlatQSLQuery> {

	constructor(
		phJsonQuery: PHJsonFlatQSLQuery,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, QueryResultType.FLAT);
		this.orderByParser = new ExactOrderByParser(this.validator);
	}

	protected getSELECTFragment(
		selectSqlFragment: string,
		selectClauseFragment: any
	): string {
		if (!selectClauseFragment) {
			throw `SELECT clause is not defined for a Flat Query`;
		}
		{
			let distinctClause = <JSONClauseField>selectClauseFragment;
			if (distinctClause.objectType == JSONClauseObjectType.DISTINCT_FUNCTION) {
				let distinctSelect = this.getSELECTFragment(selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0]);
				return `DISTINCT ${distinctSelect}`;
			}
		}
		if (!(selectClauseFragment instanceof Array)) {
			throw `SELECT clause for a Flat Query must be an Array`;
		}

		selectSqlFragment += selectClauseFragment.map(( field: JSONClauseField ) => {
			return this.getFieldSelectFragment(field, ClauseType.NON_MAPPED_SELECT_CLAUSE,
				null, selectSqlFragment);
		}).join('');


		return selectSqlFragment;
	}

	parseQueryResults(
		results: any[]
	): any[] {
		let parsedResults: any[] = [];
		if (!results || !results.length) {
			return parsedResults;
		}
		parsedResults = [];
		let lastResult;
		results.forEach(( result ) => {
			let parsedResult = this.parseQueryResult(this.phJsonQuery.select, result, [0]);
			parsedResults.push(parsedResult);
		});

		return parsedResults;
	}

	protected parseQueryResult(
		selectClauseFragment: any,
		resultRow: any,
		nextFieldIndex: number[],
	): any {
		return selectClauseFragment.map(( field: JSONClauseField ) => {
			let propertyValue = this.sqlAdaptor.getResultCellValue(resultRow, field.fieldAlias, nextFieldIndex[0], field.dataType, null);
			nextFieldIndex[0]++;
			return propertyValue;
		});
	}

}