import {IOperation} from "./Operation";
import {IQEntity} from "../entity/Entity";
import {IFieldOperation} from "./FieldOperation";
import {LogicalOperation} from "./LogicalOperation";
import {OperationType} from "./OperationType";
import {FieldType} from "../field/Field";
/**
 * Created by Papa on 6/15/2016.
 */

export interface ILogicalFieldOperation<T> extends IFieldOperation<T> {

	and(
		...ops:IFieldOperation<T>[]
	):ILogicalFieldOperation<T>;

	or(
		...ops:IFieldOperation<T>[]
	):ILogicalFieldOperation<T>;

	not(
		op:IFieldOperation<T>
	):ILogicalFieldOperation<T>;

}

export class LogicalFieldOperation<T>
extends LogicalOperation implements ILogicalFieldOperation<T> {

	fieldType:FieldType;
	includeField:boolean;
	type:OperationType;

	and(
		...ops:IFieldOperation<T>[]
	):ILogicalFieldOperation<T> {
		return <ILogicalFieldOperation<T>>this.addOperation(OperationType.AND, ops);
	}

	or(
		...ops:IFieldOperation<T>[]
	):ILogicalFieldOperation<T> {
		return <ILogicalFieldOperation<T>>this.addOperation(OperationType.OR, ops);
	}

	not(
		op:IFieldOperation<T>
	):ILogicalFieldOperation<T> {
		return <ILogicalFieldOperation<T>>this.addOperation(OperationType.NOT, [op]);
	}
}