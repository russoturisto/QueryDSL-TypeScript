import {FieldType} from "../field/Field";
import {
	ValueOperation, IValueOperation,
	JSONRawValueOperation, OperationCategory
} from "./Operation";
import {IQBooleanField} from "../field/BooleanField";
import {IQEntity} from "../entity/Entity";
import {PHRawFieldSQLQuery} from "../../query/sql/PHSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */

TODO: next, define code for converting from Raw JSON operations to Pure JSON Operations

export interface JSONRawBooleanOperation<IQ extends IQEntity> extends JSONRawValueOperation<IQBooleanField<IQ>> {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin";
	lValue: IQBooleanField<IQ>;
	rValue: boolean | boolean[] | IQBooleanField<any> | IQBooleanField<any>[] | PHRawFieldSQLQuery<IQBooleanField<any>> | PHRawFieldSQLQuery<IQBooleanField<any>>[];
}

export interface IBooleanOperation<IQ extends IQEntity> 
extends IValueOperation<boolean, JSONRawBooleanOperation<IQ>, IQ, IQBooleanField<any>> {
}

export class BooleanOperation<IQ extends IQEntity>
extends ValueOperation<boolean, JSONRawBooleanOperation<IQ>, IQ, IQBooleanField<any>> implements IBooleanOperation<IQ> {

	constructor() {
		super(OperationCategory.BOOLEAN);
	}

}