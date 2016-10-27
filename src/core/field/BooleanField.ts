import {BooleanOperation, JSONRawBooleanOperation, IBooleanOperation} from "../operation/BooleanOperation";
import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {IQOperableField, QOperableField} from "./OperableField";
import {JSONClauseObjectType, JSONClauseField} from "./Appliable";
/**
 * Created by Papa on 8/10/2016.
 */


export interface IQBooleanField<IQ extends IQEntity> extends IQOperableField<IQ, boolean, JSONRawBooleanOperation<IQ>, IBooleanOperation<IQ>, IQBooleanField<IQ>> {
}

export class QBooleanField<IQ extends IQEntity> extends QOperableField<IQ, boolean, JSONRawBooleanOperation<IQ>, IBooleanOperation<IQ>, IQBooleanField<IQ>> implements IQBooleanField<IQ> {

	constructor(
		q: IQ,
		qConstructor: new() => IQ,
		entityName: string,
		fieldName: string
	) {
		super(QBooleanField, q, qConstructor, entityName, fieldName, FieldType.BOOLEAN, new BooleanOperation<IQ>());
	}

}

export class QBooleanFunction extends QBooleanField<any> {

	constructor(
		private value: boolean
	) {
		super(null, null, null, null);
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: [],
			type: JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION,
			value: this.value
		};
	}
}
