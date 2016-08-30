import {FieldType} from "../field/Field";
import {JSONBaseOperation, Operation, IOperation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONBooleanOperation extends JSONBaseOperation {
}

export interface IBooleanOperation extends IOperation<boolean, JSONBooleanOperation> {
}

export class BooleanOperation extends Operation<boolean, JSONBooleanOperation> implements IBooleanOperation {

	constructor() {
		super(FieldType.BOOLEAN);
	}

}