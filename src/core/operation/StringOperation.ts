import {
	IValueOperation, OperationCategory,
	ValueOperation, JSONRawValueOperation
} from "./Operation";
import {IQStringField} from "../field/StringField";
import {IQEntity} from "../entity/Entity";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONRawStringOperation extends JSONRawValueOperation<IQStringField> {
	operation: "$eq" | "$isNotNull" | "$isNull" | "$in" | "$ne" | "$nin" | "$like";
	lValue:IQStringField;
	rValue: string | string[] | IQStringField | IQStringField[] | PHRawFieldSQLQuery<IQStringField> | PHRawFieldSQLQuery<IQStringField>[];
}

export interface IStringOperation extends IValueOperation<string, JSONRawStringOperation, IQStringField> {

	like(
		like:string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	):JSONRawStringOperation;

}

export class StringOperation
extends ValueOperation<string, JSONRawStringOperation, IQStringField>
implements IStringOperation {

	constructor() {
		super(OperationCategory.STRING);
	}

	like(
		like:string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	  // TODO: implement ReqExp
			//| RegExp
	):JSONRawStringOperation {
		return <any>{
			operator: "$like",
			category: this.category,
			rValue: like
		};
	}

}