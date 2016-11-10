import {NonEntitySQLStringQuery} from "./NonEntitySQLStringQuery";
import {PHJsonFieldQSLQuery} from "../ph/PHFieldSQLQuery";
import {IQEntity} from "../../../../core/entity/Entity";
import {EntityRelationRecord} from "../../../../core/entity/Relation";
import {SQLDialect, QueryResultType} from "../../SQLStringQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {ClauseType} from "../../SQLStringWhereBase";
import {ExactOrderByParser} from "../orderBy/ExactOrderByParser";
/**
 * Created by Papa on 10/29/2016.
 */

export class FieldSQLStringQuery extends NonEntitySQLStringQuery<PHJsonFieldQSLQuery> {

	constructor(
		phJsonQuery: PHJsonFieldQSLQuery,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, QueryResultType.FIELD);
		this.orderByParser = new ExactOrderByParser(this.validator);
	}

	protected getSELECTFragment(
		selectSqlFragment: string,
		selectClauseFragment: any
	): string {
		if (!selectClauseFragment) {
			throw `SELECT clause is not defined for a Field Query`;
		}
		{
			let distinctClause = <JSONClauseField>selectClauseFragment;
			if (distinctClause.objectType == JSONClauseObjectType.DISTINCT_FUNCTION) {
				let distinctSelect = this.getSELECTFragment(selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0]);
				return `DISTINCT ${distinctSelect}`;
			}
		}

		let field = <JSONClauseField>selectClauseFragment;
		selectSqlFragment += this.getFieldSelectFragment(field, ClauseType.NON_MAPPED_SELECT_CLAUSE,
			null, selectSqlFragment);
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
		let field = <JSONClauseField>selectClauseFragment;
		let propertyValue = this.sqlAdaptor.getResultCellValue(resultRow, field.fieldAlias, nextFieldIndex[0], field.dataType, null);
		nextFieldIndex[0]++;

		return propertyValue;
	}

}