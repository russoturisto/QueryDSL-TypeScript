/**
 * Created by Papa on 4/8/2016.
 */

import {isInstanceOf} from "../../../../java/lang/Object";
import {ConstantImpl} from "./ConstantImpl";
import {Template} from "./Template";


export function instanceOfOperation(
	obj:any
):boolean {
	return isInstanceOf(obj, [
		BooleanOperation,
		ComparableOperation,
		DateOperation,
		DateTimeOperation,
		DslOperation,
		EnumOperation,
		NumberOperation,
		SimpleOperation,
		StringOperation,
		TimeOperation,
		OperationImpl,
		// FIXME: add Spacial Operations
	]);
}

export function instanceOfConstant(
	obj:any
):boolean {
	return isInstanceOf(obj, [
		ConstantImpl,
		BooleanConstant,
		DateConstant,
		DateTimeConstant,
		NumberConstant,
		SimpleConstant,
		StringConstant,
		TimeConstant
	]);
}

export function instanceOfExpression(
	obj:any
):boolean {
	return isInstanceOf(obj, [
		DslExpression,
		ExpressionBase,
		MutableExpressionBase
	]);
}

export function instanceOfTemplate(
	obj:any
):boolean {
	return isInstanceOf(obj, [
		Template
	]);
}