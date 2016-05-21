/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IComparisonOperation, ComparisonOperation} from "../operation/ComparisonOperation";
import {OperationType} from "../operation/OperationType";

export enum FieldType {
	BOOLEAN,
	DATE,
	ENTITY,
	ENTITY_ARRAY,
	NUMBER,
	STRING
}

export interface IField<T, IQ extends IQEntity<IQ>> extends IComparisonOperation<T, IQ> {

}

export class Field<T, IQ extends IQEntity<IQ>> extends ComparisonOperation<T, IQ> {

	constructor(
		owningEntity:IQ,
		fieldType:FieldType,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(owningEntity, fieldType, fieldName, nativeFieldName);
		owningEntity.addEntityField(this);
	}

}
