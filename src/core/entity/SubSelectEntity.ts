import {IQEntity, QEntity} from "./Entity";
import {getNextRootEntityName} from "./Aliases";
import {JoinType, PHRawNonEntitySQLQuery} from "../../query/sql/PHSQLQuery";
import {IQNumberField, QNumberField} from "../field/NumberField";
import {IQBooleanField, QBooleanField} from "../field/BooleanField";
import {IQDateField, QDateField} from "../field/DateField";
import {IQStringField, QStringField} from "../field/StringField";
import {JSONBaseOperation} from "../operation/Operation";
/**
 * Created by Papa on 10/22/2016.
 */

export interface JSONSubQueryOperation extends JSONBaseOperation {
	operator: "$exists";
	query: PHRawNonEntitySQLQuery;
}

export interface ISubSelectQEntity extends IQEntity {

}

export class SubSelectEntity {

}

export const SUB_SELECT_ENTITY_NAME = "SubSelectEntity";

export class SubSelectQEntity extends QEntity<any> implements ISubSelectQEntity {

	constructor(
		public rootEntityPrefix: string = getNextRootEntityName(),
		public fromClausePosition: number[] = [],
		public relationPropertyName = null,
		public joinType: JoinType = null
	) {
		super(SubSelectQEntity, SubSelectEntity, SUB_SELECT_ENTITY_NAME, rootEntityPrefix, fromClausePosition, relationPropertyName, joinType);
	}

	numberField( fieldName: string ): IQNumberField<SubSelectQEntity> {
		let field = this.__entityFieldMap__[fieldName];
		if (!field) {
			field = new QNumberField<SubSelectQEntity>(this, <any>SubSelectQEntity, SUB_SELECT_ENTITY_NAME, fieldName);
		}
		return <any>field;
	}

	booleanField( fieldName: string ): IQBooleanField<SubSelectQEntity> {
		let field = this.__entityFieldMap__[fieldName];
		if (!field) {
			field = new QBooleanField<SubSelectQEntity>(this, <any>SubSelectQEntity, SUB_SELECT_ENTITY_NAME, fieldName);
		}
		return <any>field;
	}

	dateField( fieldName: string ): IQDateField<SubSelectQEntity> {
		let field = this.__entityFieldMap__[fieldName];
		if (!field) {
			field = new QDateField<SubSelectQEntity>(this, <any>SubSelectQEntity, SUB_SELECT_ENTITY_NAME, fieldName);
		}
		return <any>field;
	}

	stringField( fieldName: string ): IQStringField<SubSelectQEntity> {
		let field = this.__entityFieldMap__[fieldName];
		if (!field) {
			field = new QStringField<SubSelectQEntity>(this, <any>SubSelectQEntity, SUB_SELECT_ENTITY_NAME, fieldName);
		}
		return <any>field;
	}

	toJSON(): any {
		throw 'Not Implemented';
	}

}
