/**
 * Created by Papa on 4/21/2016.
 */
import {FieldType} from "../field/Field";


export interface JSONBaseOperation {
	"$eq"?:Date;
	"$exists"?:boolean;
	"$in"?:Date[];
	"$ne"?:Date;
	"$nin"?:Date[];
}

export interface IOperation<T, JO extends JSONBaseOperation> {

	type: FieldType;

	equals(
		value: T
	): JO;

	exists(
		exists: boolean
	): JO;

	isIn(
		values: T[]
	): JO;


	isNotNull(): JO;

	isNull(): JO;

	notEquals(
		value: T
	): JO;

	notIn(
		values: T[]
	): JO;


}

export abstract class Operation<T, JO extends JSONBaseOperation> implements IOperation<T, JO> {

	constructor(
		public type: FieldType
	) {
	}

	equals(
		value: T
	): JO {
		return <any>{
			$eq: value
		};
	}

	exists(
		exists: boolean
	): JO {
		return <any>{
			$exists: exists
		};
	}

	isNotNull(): JO {
		return this.exists(false);
	}

	isNull(): JO {
		return this.exists(true);
	}

	isIn(
		values: T[]
	): JO {
		return <any>{
			$in: values
		};
	}

	notEquals(
		value: T
	): JO {
		return <any>{
			$ne: value
		};
	}

	notIn(
		values: T[]
	): JO {
		return <any>{
			$nin: values
		};
	}

}
