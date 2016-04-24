/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation} from "./Operation";
import {OperationType} from "./OperationType";

export interface IComparisonOperation<T, Q extends IQEntity<Q>, C extends IComparisonOperation<T, Q, C>>
extends IOperation<Q> {

	equals(
		value:T | IComparisonOperation<T, Q, C>
	):IComparisonOperation<T, Q, C>;

	exists(
		exists:boolean
	):IComparisonOperation<T, Q, C>;

	greaterThan(
		greaterThan:number
	):IComparisonOperation<T, Q, C>;

	greaterThanOrEquals(
		greaterThanOrEquals:number
	):IComparisonOperation<T, Q, C>;

	in(
		values:T[] | IComparisonOperation<T, Q, C>[]
	):IComparisonOperation<T, Q, C>;

	like(
		like:string | RegExp
	):IComparisonOperation<T, Q, C>;

	lessThan(
		lessThan:number
	):IComparisonOperation<T, Q, C>;

	lessThanOrEquals(
		lessThanOrEquals:number
	):IComparisonOperation<T, Q, C>;

	notEquals(
		value:T | IComparisonOperation<T, Q, C>
	):IComparisonOperation<T, Q, C>;

	notIn(
		values:T[] | IComparisonOperation<T, Q, C>[]
	):IComparisonOperation<T, Q, C>;

	/*
	 $type, $all, $size, $mod, $regex, $elemMatch
	 */

}

export abstract class ComparisonOperation<T, Q extends IQEntity<Q>, C extends ComparisonOperation<T, Q, C>>
extends Operation<Q> implements IComparisonOperation<T, Q, C> {

	isDefined:boolean;
	isEqComparison:boolean;
	isInComparison:boolean;
	isNinComparison:boolean;
	isNeComparison:boolean;
	isAnyComparison:boolean;
	isRegExp:boolean;
	anyValue:any;
	existsValue:boolean;
	eqValue:T | IComparisonOperation<T, Q, C>;
	gtValue:number;
	gteValue:number;
	inValues:T[] | IComparisonOperation<T, Q, C>[];
	likeValue:string|RegExp;
	ltValue:number;
	lteValue:number;
	neValue:T | IComparisonOperation<T, Q, C>;
	ninValues:T[] | IComparisonOperation<T, Q, C>[];

	constructor(
		q:Q,
		fieldName:string,
		type?:OperationType,
		nativeFieldName:string = fieldName
	) {
		super(q, fieldName, type, nativeFieldName);
	}

	valueEquals<OQ extends IQEntity<OQ>, OP extends Operation<Q>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {
		if (this.type !== otherOp.type) {
			return false;
		}

		let otherCOp:ComparisonOperation<T, Q, C> = <any>otherOp;
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
	):ComparisonOperation<T, Q, C> {
		if (this.isDefined) {
			throw `This operation is already defined, cannot create another one from it`;
		}
		let definedOperation = this.getInstance(type);
		definedOperation.isDefined = true;

		return definedOperation;
	}

	abstract getInstance(
		type:OperationType
	):ComparisonOperation<T, Q, C>;

	equals(
		value:T | IComparisonOperation<T, Q, C>
	):ComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.EQUALS);

		instance.isEqComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
		instance.eqValue = instance.anyValue = value;

		return instance;
	}

	exists(
		exists:boolean
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.EXISTS);

		instance.existsValue = instance.anyValue = exists;

		return instance;
	}

	greaterThan(
		greaterThan:number
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.GREATER_THAN);

		instance.gtValue = instance.anyValue = greaterThan;

		return instance;
	}

	greaterThanOrEquals(
		greaterThanOrEquals:number
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.GREATER_THAN_OR_EQUALS);

		instance.gteValue = instance.anyValue = greaterThanOrEquals;

		return instance;
	}

	in(
		values:T[] | IComparisonOperation<T, Q, C>[]
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.IN);

		instance.isInComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
		instance.inValues = instance.anyValue = values;

		return instance;
	}

	like(
		like:string | RegExp
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.LIKE);

		instance.isRegExp = instance.isAnyComparison = like instanceof RegExp;
		instance.likeValue = instance.anyValue = like;

		return instance;
	}

	lessThan(
		lessThan:number
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.LESS_THAN);

		instance.ltValue = instance.anyValue = lessThan;

		return instance;
	}

	lessThanOrEquals(
		greaterThanOrEquals:number
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.LESS_THAN_OR_EQUALS);

		instance.lteValue = instance.anyValue = greaterThanOrEquals;

		return instance;
	}

	notEquals(
		value:T | IComparisonOperation<T, Q, C>
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.NOT_EQUALS);

		instance.isNeComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
		instance.neValue = instance.anyValue = value;

		return instance;
	}

	notIn(
		values:T[] | IComparisonOperation<T, Q, C>[]
	):IComparisonOperation<T, Q, C> {
		let instance = this.getDefinedInstance(OperationType.NOT_IN);

		instance.isNinComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
		instance.ninValues = instance.anyValue = values;

		return instance;
	}

}
