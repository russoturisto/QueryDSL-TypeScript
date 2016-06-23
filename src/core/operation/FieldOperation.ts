import {IQEntity} from "../entity/Entity";
import {IOperation, JSONOperation} from "./Operation";
import {IQueryOperation, QueryOperation} from "./QueryOperation";
import {PH_INCLUDE} from "../../query/PHQuery";
import {OperationType} from "./OperationType";
import {FieldType} from "../field/Field";
/**
 * Created by Papa on 6/15/2016.
 */


export interface JSONFieldReference {

}

export interface IFieldOperation<T> extends IQueryOperation {
	fieldType:FieldType;
	includeField:boolean;
	
}

export abstract class FieldOperation<T>  extends QueryOperation {

	type:OperationType;
	includeField:boolean;


	constructor(
		type:OperationType,
		public fieldType:FieldType
	) {
		super(type);
	}

	include():FieldOperation<T> {
		this.includeField = true;

		return this;
	}

	toJSON():JSONOperation {
		let json = super.toJSON();
		if(this.includeField) {
			json[PH_INCLUDE] = true;
		}

		return json;
	}
}