/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IComparisonOperation, ComparisonOperation} from "../operation/ComparisonOperation";
import {OperationType} from "../operation/OperationType";

export enum FieldType {
	BOOLEAN,
	BOOLEAN_ARRAY,
	DATE,
	DATE_ARRAY,
	NUMBER,
	NUMBER_ARRAY,
	STRING,
	STRING_ARRAY
}

export interface IQField<T, IQ extends IQEntity<IQ>> extends IComparisonOperation<T, IQ> {

}

export class QField<T, IQ extends IQEntity<IQ>> extends ComparisonOperation<T, IQ> {

	constructor(
		q:IQ,
		public qConstructor: new() => IQ,
		fieldType:FieldType,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(q, fieldType, fieldName, nativeFieldName);
		q.addEntityField(this);
	}

}
