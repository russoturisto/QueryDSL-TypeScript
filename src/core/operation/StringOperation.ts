import {
	IValueOperation, OperationCategory,
	ValueOperation, JSONRawValueOperation
} from "./Operation";
import {IQStringField} from "../field/StringField";
import {IQEntity} from "../entity/Entity";
import {PHRawFieldSQLQuery} from "../../query/sql/PHSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONRawStringOperation<IQ extends IQEntity> extends JSONRawValueOperation<IQStringField<IQ>> {
	operation: "$eq" | "$isNotNull" | "$isNull" | "$in" | "$ne" | "$nin" | "$like";
	lValue:IQStringField<IQ>;
	rValue: string | string[] | IQStringField<any> | IQStringField<any>[] | PHRawFieldSQLQuery<IQStringField<any>> | PHRawFieldSQLQuery<IQStringField<any>>[];
}

export interface IStringOperation<IQ extends IQEntity> extends IValueOperation<string, JSONRawStringOperation<IQ>, IQ, IQStringField<any>> {

	like(
		like:string | IQStringField<any> | PHRawFieldSQLQuery<IQStringField<any>>
	):JSONRawStringOperation<IQ>;

}

export class StringOperation<IQ extends IQEntity>
extends ValueOperation<string, JSONRawStringOperation<IQ>, IQ, IQStringField<any>>
implements IStringOperation<IQ> {

	constructor() {
		super(OperationCategory.STRING);
	}

	like(
		like:string | IQStringField<any> | PHRawFieldSQLQuery<IQStringField<any>>
	  // TODO: implement ReqExp
			//| RegExp
	):JSONRawStringOperation<IQ>{
		return <any>{
			operator: "$like",
			category: this.category,
			rValue: like
		};
	}

}