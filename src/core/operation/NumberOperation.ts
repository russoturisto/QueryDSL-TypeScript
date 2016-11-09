import {
	IValueOperation, ValueOperation,
	OperationCategory, JSONRawValueOperation
} from "./Operation";
import {IQEntity} from "../entity/Entity";
import {IQNumberField} from "../field/NumberField";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONRawNumberOperation extends JSONRawValueOperation<IQNumberField> {
	operator: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQNumberField;
	rValue: IQNumberField | IQNumberField[] | PHRawFieldSQLQuery<IQNumberField> | PHRawFieldSQLQuery<IQNumberField>[];
}

export interface INumberOperation
extends IValueOperation<JSONRawNumberOperation, IQNumberField> {

}

export class NumberOperation<IQ extends IQEntity>
extends ValueOperation<JSONRawNumberOperation, IQNumberField> implements INumberOperation {

	constructor() {
		super(OperationCategory.NUMBER);
	}

}