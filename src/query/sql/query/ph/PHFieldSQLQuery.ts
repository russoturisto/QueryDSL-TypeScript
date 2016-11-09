import {
	PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, NON_ENTITY_SELECT_ERROR_MESSAGE,
	PHJsonNonEntitySqlQuery
} from "./PHNonEntitySQLQuery";
import {PHSQLQuery} from "../../PHSQLQuery";
import {JSONClauseField, JSONClauseObjectType, SQLDataType} from "../../../../core/field/Appliable";
import {QField, IQField} from "../../../../core/field/Field";
import {IQDistinctFunction, QDistinctFunction} from "../../../../core/field/Functions";
import {EntityAliases} from "../../../../core/entity/Aliases";
import {QBooleanField} from "../../../../core/field/BooleanField";
import {QDateField} from "../../../../core/field/DateField";
import {QNumberField} from "../../../../core/field/NumberField";
import {QStringField} from "../../../../core/field/StringField";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonFieldQSLQuery extends PHJsonNonEntitySqlQuery {
	select: JSONClauseField;
	objectType: JSONClauseObjectType;
	dataType: SQLDataType;
}

export interface PHRawFieldSQLQuery<IQF extends IQField<IQF>>
extends PHRawNonEntitySQLQuery {
	select: IQF | IQDistinctFunction<IQF>;
}

export class PHFieldSQLQuery<IQF extends IQField<IQF>> extends PHDistinguishableSQLQuery implements PHSQLQuery {

	// private qEntityMap: {[entityName: string]: QEntity<any>},
	//	private entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
//		private entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	constructor(
		private phRawQuery: PHRawFieldSQLQuery<IQF>,
		entityAliases: EntityAliases
	) {
		super(entityAliases);
	}

	nonDistinctSelectClauseToJSON( rawSelect: any ): any {
		if (!(this.phRawQuery.select instanceof QField)) {
			throw NON_ENTITY_SELECT_ERROR_MESSAGE;
		}
		return (<QField<any>><any>this.phRawQuery.select).toJSON(this.columnAliases, true);
	}

	toJSON(): PHJsonFieldQSLQuery {

		let select = this.selectClauseToJSON(this.phRawQuery.select);

		let jsonFieldQuery: PHJsonFieldQSLQuery = {
			select: select,
			objectType: JSONClauseObjectType.FIELD_QUERY,
			dataType: this.getClauseDataType()
		};

		return <PHJsonFieldQSLQuery>this.getNonEntitySqlQuery(this.phRawQuery, jsonFieldQuery);
	}

	getClauseDataType():SQLDataType {
		let selectField = this.phRawQuery.select;
		if(selectField instanceof QDistinctFunction) {
			selectField = selectField.getSelectClause();
		}
		if(selectField instanceof QBooleanField) {
			return SQLDataType.BOOLEAN;
		} else if (selectField instanceof QDateField) {
			return SQLDataType.DATE;
		} else if (selectField instanceof QNumberField) {
			return SQLDataType.NUMBER;
		} else if (selectField instanceof QStringField) {
			return SQLDataType.STRING;
		} else {
			throw `Unsupported type of select field in Field Query`;
		}
	}

}

