/**
 * Created by Papa on 10/28/2016.
 */

import {PHJsonMappedQSLQuery} from "../ph/PHMappedSQLQuery";
import {SQLDialect, QueryResultType} from "../../SQLStringQuery";
import {IQEntity} from "../../../../core/entity/Entity";
import {EntityRelationRecord} from "../../../../core/entity/Relation";
import {NonEntitySQLStringQuery} from "./NonEntitySQLStringQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {ClauseType} from "../../SQLStringWhereBase";
import {MappedOrderByParser} from "../orderBy/MappedOrderByParser";
import {MappedQueryResultParser} from "../result/MappedQueryResultParser";
import {AliasCache} from "../../../../core/entity/Aliases";
/**
 *
 */
export class MappedSQLStringQuery extends NonEntitySQLStringQuery<PHJsonMappedQSLQuery> {

	protected queryParser: MappedQueryResultParser = new MappedQueryResultParser();

	constructor(
		phJsonQuery: PHJsonMappedQSLQuery,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, QueryResultType.MAPPED_HIERARCHICAL);
		this.orderByParser = new MappedOrderByParser(this.validator);
	}

	protected getSELECTFragment(
		selectSqlFragment: string,
		selectClauseFragment: any
	): string {
		{
			let distinctClause = <JSONClauseField>selectClauseFragment;
			if (distinctClause.objectType == JSONClauseObjectType.DISTINCT_FUNCTION) {
				let distinctSelect = this.getSELECTFragment(selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0]);
				return `DISTINCT ${distinctSelect}`;
			}
		}

		let retrieveAllOwnFields: boolean = false;
		let numProperties = 0;
		for (let propertyName in selectClauseFragment) {
			if (propertyName === '*') {
				retrieveAllOwnFields = true;
				delete selectClauseFragment['*'];
				throw `'*' operator isn't yet implemented in mapped queries`;
			}
			numProperties++;
		}
		if (numProperties === 0) {
			if (selectSqlFragment) {
				throw `Mapped query must have fields in sub-select clause`;
			} else {
				return '*';
			}
		}
		//  For {} select causes or if '*' is present, retrieve the entire object
		if (retrieveAllOwnFields) {
			throw `'*' operator isn't yet implemented in mapped queries`;
		}

		for (let propertyName in selectClauseFragment) {
			let value = <JSONClauseField>selectClauseFragment[propertyName];
			// Skip undefined values
			if (value === undefined) {
				continue;
			}
			selectSqlFragment += this.getFieldSelectFragment(value, ClauseType.MAPPED_SELECT_CLAUSE, ()=> {
				return this.getSELECTFragment(selectSqlFragment, selectClauseFragment[propertyName]);
			}, selectSqlFragment);
		}

		return selectSqlFragment;
	}

	/**
	 * Entities get merged if they are right next to each other in the result set.  If they are not, they are
	 * treated as separate entities - hence, your sort order matters.
	 *
	 * @param results
	 * @returns {any[]}
	 */
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
			let aliasCache = new AliasCache();
			let parsedResult = this.parseQueryResult(this.phJsonQuery.select, result, [0], aliasCache, aliasCache.getFollowingAlias());
			if (!lastResult) {
				parsedResults.push(parsedResult);
			} else if (lastResult !== parsedResult) {
				lastResult = parsedResult;
				parsedResults.push(parsedResult);
			}
			this.queryParser.flushRow();
		});

		return parsedResults;
	}

	protected parseQueryResult(
		selectClauseFragment: any,
		resultRow: any,
		nextFieldIndex: number[],
		aliasCache: AliasCache,
		entityAlias: string
	): any {
		// Return blanks, primitives and Dates directly
		if (!resultRow || !(resultRow instanceof Object) || resultRow instanceof Date) {
			return resultRow;
		}
		{
			let distinctClause = <JSONClauseField>selectClauseFragment;
			if (distinctClause.objectType == JSONClauseObjectType.DISTINCT_FUNCTION) {
				return this.parseQueryResult(distinctClause.__appliedFunctions__[0].parameters[0], resultRow, nextFieldIndex, aliasCache, entityAlias);
			}
		}

		let resultObject = this.queryParser.addEntity(entityAlias);

		for (let propertyName in selectClauseFragment) {
			if (selectClauseFragment[propertyName] === undefined) {
				continue;
			}
			let jsonClauseField: JSONClauseField = selectClauseFragment[propertyName];
			let dataType = jsonClauseField.dataType;
			// Must be a sub-query
			if (!dataType) {
				let childResultObject = this.parseQueryResult(
					jsonClauseField,
					resultRow,
					nextFieldIndex,
					aliasCache,
					aliasCache.getFollowingAlias()
				);
				this.queryParser.bufferOneToManyCollection(entityAlias, resultObject, propertyName, childResultObject);
			} else {
				let propertyValue = this.sqlAdaptor.getResultCellValue(resultRow, jsonClauseField.fieldAlias, nextFieldIndex[0], dataType, null);
				this.queryParser.addProperty(entityAlias, resultObject, dataType, propertyName, propertyValue);
			}
			nextFieldIndex[0]++;
		}

		return this.queryParser.flushEntity(
			entityAlias,
			resultObject
		);
	}
}