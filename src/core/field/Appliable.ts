import {JSONSqlFunctionCall, SqlFunction} from "./Functions";
import {IQEntity} from "../entity/Entity";
import {QField} from "./Field";
import {QManyToOneRelation, QRelation} from "../entity/Relation";
import {EntityMetadata} from "../entity/EntityMetadata";
import {MetadataUtils} from "../entity/metadata/MetadataUtils";
/**
 * Created by Papa on 10/19/2016.
 */

export enum JSONClauseObjectType {
	FIELD,
	FUNCTION,
	MANY_TO_ONE_RELATION
}

export interface JSONClauseObject {
	appliedFunctions: JSONSqlFunctionCall[];
	type: JSONClauseObjectType;
}

export interface JSONClauseField extends JSONClauseObject {
	propertyName: string,
	tableAlias: string
}

export interface Appliable<JCO extends JSONClauseObject, IQ extends IQEntity> {
	fieldName: string;
	appliedFunctions: JSONSqlFunctionCall[];
	q: IQ;

	applySqlFunction<A extends Appliable<JCO, IQ>>( sqlFunctionCall: JSONSqlFunctionCall ): A;
	toJSON(): JCO;
}

export interface ISQLFunctionAdaptor {

	getFunctionCalls<A extends Appliable<any, any>>(
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

	getFunctionCalls<A extends Appliable<any, any>>(
		clause: JSONClauseObject,
		qEntityMapByAlias: {[alias: string]: IQEntity}
	): string {
		let stringValue;
		switch(clause.type) {
			case JSONClauseObjectType.FUNCTION:
				break;
			case JSONClauseObjectType.FIELD:
			case JSONClauseObjectType.MANY_TO_ONE_RELATION:
				break;
		}
		if (clause.type === JSONClauseObjectType.FIELD || clause.type === JSONClauseObjectType.MANY_TO_ONE_RELATION) {
			let fieldClause:JSONClauseField = <JSONClauseField>clause;
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
		clause.appliedFunctions.forEach(( appliedFunction ) => {
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