/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation} from "../operation/Operation";
import {QRelation} from "../entity/Relation";
import {FieldInOrderBy, SortOrder, JSONFieldInOrderBy} from "./FieldInOrderBy";
import {JSONSqlFunctionCall} from "./Functions";
import {Appliable, JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";

export enum FieldType {
	BOOLEAN,
	DATE,
	NUMBER,
	STRING
}

export interface Orderable<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, any>> {

	asc(): JSONFieldInOrderBy;

	desc(): JSONFieldInOrderBy;

}

export interface IQField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>, IQF extends IQField<IQ, T, JO, IO, any>>
extends Orderable<IQ, IQF> {

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO;

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO;


	isNotNull(): JO;

	isNull(): JO;

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO;

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO;

}

export abstract class QField<IQ extends IQEntity, T, JO extends JSONRawValueOperation<IQF>, IO extends IValueOperation<T, JO, IQ, IQF>, IQF extends IQField<any, T, JO, IO, any>>
implements IQField<IQ, T, JO, IO, IQF>, Appliable<JSONClauseField, IQ, IQF> {0

	__appliedFunctions__: JSONSqlFunctionCall[] = [];

	constructor(
		// All child field constructors must have the following signature (4 parameters):
		public childConstructor: new(
			q: IQ,
			qConstructor: new() => IQ,
			entityName: string,
			fieldName: string,
			fieldType: FieldType
		) => IQField<IQ, T, JO, IO, IQF>,
		public q: IQ,
		public qConstructor: new() => IQ,
		public entityName: string,
		public fieldName: string,
		public fieldType: FieldType,
		public operation: IO
	) {
		if (q) {
			q.addEntityField(fieldName, this);
		}
	}

	protected getFieldKey() {
		let key = `${QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition)}.${this.fieldName}`;

		return key;
	}

	setOperation(
		jsonOperation: JO
	): JO {
		jsonOperation.lValue = <any>this;

		return jsonOperation;
	}

	objectEquals<QF extends QField<any, any, any, any, any>>(
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

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.setOperation(this.operation.equals(value));
	}


	isNotNull(): JO {
		return this.setOperation(this.operation.isNotNull());
	}

	isNull(): JO {
		return this.setOperation(this.operation.isNull());
	}

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO {
		return this.setOperation(this.operation.isIn(values));
	}

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.setOperation(this.operation.notEquals(value));
	}

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO {
		return this.setOperation(this.operation.notIn(values));
	}

	asc(): JSONFieldInOrderBy {
		return new FieldInOrderBy<IQ>(this, SortOrder.ASCENDING).toJSON();
	}

	desc(): JSONFieldInOrderBy {
		return new FieldInOrderBy<IQ>(this, SortOrder.DESCENDING).toJSON();
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQField<IQ, T, JO, IO, IQF> {
		let appliedIField = new this.childConstructor(this.q, this.qConstructor, this.entityName, this.fieldName, this.fieldType);
		let appliedField = <QField<IQ, T, JO, IO, IQF>><any>appliedIField;
		appliedField.__appliedFunctions__ = appliedField.__appliedFunctions__.concat(this.__appliedFunctions__);
		appliedField.__appliedFunctions__.push(sqlFunctionCall);

		return appliedIField;
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: this.__appliedFunctions__,
			propertyName: this.fieldName,
			tableAlias: QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
			type: JSONClauseObjectType.FIELD
		};
	}

}