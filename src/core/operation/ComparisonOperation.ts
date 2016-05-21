/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation} from "./Operation";
import {OperationType} from "./OperationType";
import {FieldType} from "../field/Field";

export interface IComparisonOperation<T, Q extends IQEntity<Q>>
extends IOperation<Q> {

	equals(
		value:T | IComparisonOperation<T, Q>
	):IComparisonOperation<T, Q>;

	exists(
		exists:boolean
	):IComparisonOperation<T, Q>;

	greaterThan(
		greaterThan:number
	):IComparisonOperation<T, Q>;

	greaterThanOrEquals(
		greaterThanOrEquals:number
	):IComparisonOperation<T, Q>;

	in(
		values:T[] | IComparisonOperation<T, Q>[]
	):IComparisonOperation<T, Q>;

	like(
		like:string | RegExp
	):IComparisonOperation<T, Q>;

	lessThan(
		lessThan:number
	):IComparisonOperation<T, Q>;

	lessThanOrEquals(
		lessThanOrEquals:number
	):IComparisonOperation<T, Q>;

	notEquals(
		value:T | IComparisonOperation<T, Q>
	):IComparisonOperation<T, Q>;

	notIn(
		values:T[] | IComparisonOperation<T, Q>[]
	):IComparisonOperation<T, Q>;

	/*
	 $type, $all, $size, $mod, $regex, $elemMatch
	 */

}

export class ComparisonOperation<T, IQ extends IQEntity<IQ>>
extends Operation<IQ> implements IComparisonOperation<T, IQ> {

	isDefined:boolean;
	isEqComparison:boolean;
	isInComparison:boolean;
	isNinComparison:boolean;
	isNeComparison:boolean;
	isAnyComparison:boolean;
	isRegExp:boolean;
	anyValue:any;
	existsValue:boolean;
	eqValue:T | IComparisonOperation<T, IQ>;
	gtValue:number;
	gteValue:number;
	inValues:T[] | IComparisonOperation<T, IQ>[];
	likeValue:string|RegExp;
	ltValue:number;
	lteValue:number;
	neValue:T | IComparisonOperation<T, IQ>;
	ninValues:T[] | IComparisonOperation<T, IQ>[];

	constructor(
		owningEntity:IQ,
		fieldType:FieldType,
		fieldName:string,
		nativeFieldName:string = fieldName,
		type?:OperationType
	) {
		super(owningEntity, fieldType, fieldName, nativeFieldName, type);
	}

	valueEquals<OQ extends IQEntity<OQ>, OP extends Operation<IQ>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {
		if (this.type !== otherOp.type) {
			return false;
		}

		let otherCOp:ComparisonOperation<T, IQ> = <any>otherOp;
		if (this.isAnyComparison !== otherCOp.isAnyComparison) {
			return false;
		}
		if (this.anyValue !== otherCOp.anyValue) {
			return false;
		}

		return true;
	}

	getDefinedInstance(
		type:OperationType
	):ComparisonOperation<T, IQ> {
		if (this.isDefined) {
			throw `This operation is already defined, cannot create another one from it`;
		}
		let definedOperation = new ComparisonOperation<T, IQ>(this.q, this.fieldType, this.fieldName, this.nativeFieldName, type);
		definedOperation.isDefined = true;

		return definedOperation;
	}

	equals(
		value:T | IComparisonOperation<T, IQ>
	):ComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.EQUALS);

		instance.isEqComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
		instance.eqValue = instance.anyValue = value;

		return instance;
	}

	exists(
		exists:boolean
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.EXISTS);

		instance.existsValue = instance.anyValue = exists;

		return instance;
	}

	greaterThan(
		greaterThan:number
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.GREATER_THAN);

		instance.gtValue = instance.anyValue = greaterThan;

		return instance;
	}

	greaterThanOrEquals(
		greaterThanOrEquals:number
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.GREATER_THAN_OR_EQUALS);

		instance.gteValue = instance.anyValue = greaterThanOrEquals;

		return instance;
	}

	in(
		values:T[] | IComparisonOperation<T, IQ>[]
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.IN);

		instance.isInComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
		instance.inValues = instance.anyValue = values;

		return instance;
	}

	like(
		like:string | RegExp
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.LIKE);

		instance.isRegExp = instance.isAnyComparison = like instanceof RegExp;
		instance.likeValue = instance.anyValue = like;

		return instance;
	}

	lessThan(
		lessThan:number
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.LESS_THAN);

		instance.ltValue = instance.anyValue = lessThan;

		return instance;
	}

	lessThanOrEquals(
		greaterThanOrEquals:number
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.LESS_THAN_OR_EQUALS);

		instance.lteValue = instance.anyValue = greaterThanOrEquals;

		return instance;
	}

	notEquals(
		value:T | IComparisonOperation<T, IQ>
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.NOT_EQUALS);

		instance.isNeComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
		instance.neValue = instance.anyValue = value;

		return instance;
	}

	notIn(
		values:T[] | IComparisonOperation<T, IQ>[]
	):IComparisonOperation<T, IQ> {
		let instance = this.getDefinedInstance(OperationType.NOT_IN);

		instance.isNinComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
		instance.ninValues = instance.anyValue = values;

		return instance;
	}

}
