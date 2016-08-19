/**
 * Created by Papa on 4/21/2016.
 */
import {FieldType} from "../field/Field";


export interface JSONBaseOperation {
}

export interface IOperation {

	type:FieldType;

}

export abstract class Operation implements IOperation {

	constructor(
		public type:FieldType
	) {
	}

}
