/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation} from "../operation/Operation";
import {QRelation} from "../entity/Relation";
import {FieldInOrderBy, SortOrder, JSONFieldInOrderBy, IFieldInOrderBy} from "./FieldInOrderBy";
import {JSONSqlFunctionCall} from "./Functions";
import {Appliable, JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery, PHFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";

export enum FieldType {
	BOOLEAN,
	DATE,
	NUMBER,
	STRING
}

export interface Orderable<IQ extends IQEntity, IQF extends IQField<IQ, any>> {

	asc(): IFieldInOrderBy<IQ, IQF>;

	desc(): IFieldInOrderBy<IQ, IQF>;

}

export interface IQField<IQ extends IQEntity, IQF extends IQField<IQ, any>>
extends Orderable<IQ, IQF> {

}

export abstract class QField<IQ extends IQEntity, IQF extends IQField<any, any>>
implements IQField<IQ, IQF>, Appliable<JSONClauseField, IQ, IQF> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];
	__subQuery__: PHRawFieldSQLQuery<IQF>;

	constructor(
		// All child field constructors must have the following signature (4 parameters):
		public childConstructor: new(
			...args: any[]
		) => IQField<IQ, IQF>,
		public q: IQ,
		public qConstructor: new() => IQ,
		public entityName: string,
		public fieldName: string,
		public fieldType: FieldType,
	) {
	}

	protected getFieldKey() {
		let key = `${QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition)}.${this.fieldName}`;

		return key;
	}


	objectEquals<QF extends QField<any, any>>(
		otherField: QF,
		checkValue?: boolean
	): boolean {

		if (this.q.constructor !== otherField.q.constructor) {
			return false;
		}
		if (this.constructor !== otherField.constructor) {
			return false;
		}
		if (this.fieldType !== otherField.fieldType) {
			return false;
		}
		if (this.fieldName !== otherField.fieldName) {
			return false;
		}

		return true;
	}

	asc(): IFieldInOrderBy<IQ, IQF> {
		return new FieldInOrderBy<IQ, IQF>(this, SortOrder.ASCENDING);
	}

	desc(): IFieldInOrderBy<IQ, IQF> {
		return new FieldInOrderBy<IQ, IQF>(this, SortOrder.DESCENDING);
	}

	getInstance(): QField<IQ, IQF> {
		return <QField<IQ, IQF>><any>new this.childConstructor(this.q, this.qConstructor, this.entityName, this.fieldName, this.fieldType);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQF {
		let appliedField = this.getInstance();
		appliedField.__appliedFunctions__ = appliedField.__appliedFunctions__.concat(this.__appliedFunctions__);
		appliedField.__appliedFunctions__.push(sqlFunctionCall);

		return <IQF><any>appliedField;
	}

	addSubQuery( subQuery: PHRawFieldSQLQuery<IQF> ): IQF {
		let appliedField = this.getInstance();
		appliedField.__subQuery__ = subQuery;

		return <IQF><any>appliedField;
	}

	toJSON(): JSONClauseField {
		let jsonField: JSONClauseField = {
			__appliedFunctions__: this.__appliedFunctions__,
			propertyName: this.fieldName,
			tableAlias: QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
			type: JSONClauseObjectType.FIELD
		};
		if (this.__subQuery__) {
			let subSelectQuery = new PHFieldSQLQuery<IQF>(this.__subQuery__).toJSON();
			jsonField.subQuery = subSelectQuery;
		}

		return jsonField;
	}

}