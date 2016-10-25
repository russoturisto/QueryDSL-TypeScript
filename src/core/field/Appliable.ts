import {JSONSqlFunctionCall} from "./Functions";
import {IQEntity} from "../entity/Entity";
import {IQField} from "./Field";
import {EntityMetadata} from "../entity/EntityMetadata";
import {MetadataUtils} from "../entity/metadata/MetadataUtils";
import {JSONFunctionOperation} from "../operation/Operation";
/**
 * Created by Papa on 10/19/2016.
 */

export enum JSONClauseObjectType {
	DISTINCT_FUNCTION,
	EXISTS_FUNCTION,
	FIELD,
	FIELD_FUNCTION,
	FIELD_QUERY,
	MANY_TO_ONE_RELATION
}

export interface JSONClauseObject {
	__appliedFunctions__: JSONSqlFunctionCall[];
	type: JSONClauseObjectType;
}

export interface JSONClauseField extends JSONClauseObject {
	propertyName?: string,
	tableAlias?: string
}

export interface Appliable<JCO extends JSONClauseObject, IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, any>> {
	// fieldName: string;
	__appliedFunctions__: JSONSqlFunctionCall[];
	// q: IQ;

	applySqlFunction<A extends Appliable<JCO, IQ, IQF>>( sqlFunctionCall: JSONSqlFunctionCall ): A;
	toJSON(): JCO | JSONFunctionOperation;
}

export interface ISQLFunctionAdaptor {

	getFunctionCalls<A extends Appliable<any, any, any>>(
		appliable: A,
		qEntityMapByAlias: {[entityName: string]: IQEntity}
	): string ;

	getFunctionCall(
		jsonFunctionCall: JSONSqlFunctionCall,
		value: string,
		qEntityMapByAlias: {[entityName: string]: IQEntity}
	): string;

}

export abstract class AbstractFunctionAdaptor implements ISQLFunctionAdaptor {

	getFunctionCalls<A extends Appliable<any, any, any>>(
		clause: JSONClauseObject,
		qEntityMapByAlias: {[alias: string]: IQEntity}
	): string {
		let stringValue;
		if (clause.type === JSONClauseObjectType.FIELD || clause.type === JSONClauseObjectType.MANY_TO_ONE_RELATION) {
			let fieldClause: JSONClauseField = <JSONClauseField>clause;
			let alias = fieldClause.tableAlias;
			let qEntity = qEntityMapByAlias[alias];
			let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
			let columnName;
			if (clause.type === JSONClauseObjectType.FIELD) {
				columnName = MetadataUtils.getPropertyColumnName(fieldClause.propertyName, entityMetadata, alias);
			} else {
				columnName = MetadataUtils.getJoinColumnName(fieldClause.propertyName, entityMetadata, alias);
			}
			stringValue = `${alias}.${columnName}`;
		}
		clause.__appliedFunctions__.forEach(( appliedFunction ) => {
			stringValue = this.getFunctionCall(appliedFunction, stringValue, qEntityMapByAlias);
		});

		return stringValue;
	}

	abstract getFunctionCall(
		jsonFunctionCall: JSONSqlFunctionCall,
		value: string,
		qEntityMapByAlias: {[entityName: string]: IQEntity}
	): string;

}