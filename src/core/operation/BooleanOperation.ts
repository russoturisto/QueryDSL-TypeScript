import {
	ValueOperation, IValueOperation,
	JSONRawValueOperation, OperationCategory
} from "./Operation";
import {IQBooleanField} from "../field/BooleanField";
import {IQEntity} from "../entity/Entity";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONRawBooleanOperation extends JSONRawValueOperation<boolean, IQBooleanField> {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQBooleanField;
	rValue: boolean | boolean[] | IQBooleanField | IQBooleanField[] | PHRawFieldSQLQuery<IQBooleanField> | PHRawFieldSQLQuery<IQBooleanField>[];
}

export interface IBooleanOperation
extends IValueOperation<boolean, JSONRawBooleanOperation, IQBooleanField> {
}

export class BooleanOperation<IQ extends IQEntity>
extends ValueOperation<boolean, JSONRawBooleanOperation, IQBooleanField> implements IBooleanOperation {

	constructor() {
		super(OperationCategory.BOOLEAN);
	}

}