/*
 * Copyright 2015, The Querydsl Team (http://www.querydsl.com/team)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * {@code Template} provides serialization templates for {@link Operation},
 * {@link TemplateExpression} and {@link Path} serialization
 *
 * @author tiwe
 *
 */
import {Serializable} from "../../../../java/io/Serializable";
import {ImmutableClass} from "../../../../javax/annotation/concurrent/Immutable";
import {FinalClass, Final, FinalParameter} from "../../../../java/Final";
import {ExpressionType, Expression} from "./Expression";
import {ExpressionBase} from "./ExpressionBase";
import {Transient} from "../../../../java/Transient";
import {isInstanceOf, hashCode} from "../../../../java/lang/Object";
import {ExpressionUtils} from "./ExpressionUtils";
import {Operator} from "./Operator";
import {Operation as OperationInterface}  from "./Operation";
import {ConstantImpl} from "./ConstantImpl";
import {Constant} from "./Constant";
import {IllegalArgumentException} from "../../../../java/lang/IllegalArgumentException";
import {Ops} from "./Ops";
import {instanceOfOperation, instanceOfConstant, instanceOfExpression, instanceOfTemplate} from "./TSUtils";


export namespace Template {
	/**
	 * General template element
	 */
	@ImmutableClass
	export abstract class Element implements Serializable {

		@Final
		private static serialVersionUID:number = 3396877288101929387;

		public abstract convert( args:Array<any> ):any;

		public abstract isString():boolean;

	}

	/**
	 * Expression as string
	 */
	@FinalClass
	export class AsString extends Element {

		@Final
		private static serialVersionUID:number = -655362047873616197;

		@Final
		private index:number;

		@Final
		private toString:number;

		constructor( index:number ) {
			this.index = index;
			this.toString = index + "s";
		}

		public convert( @FinalParameter  args:Array<any> ):any {
			let arg = args[this.index];
			if (arg.getType && typeof arg.getType === 'getType' && arg.getType() === ExpressionType.CONSTANT) {
				return (<ExpressionBase>arg).toString();
			}
			return arg;
		}

		public getIndex():number {
			return this.index;
		}

		public  isString():boolean {
			return true;
		}

		public toString():string {
			return this.toString;
		}

	}

	/**
	 * Static text element
	 */
	@FinalClass
	export class StaticText extends Element {

		@Final
		private static serialVersionUID:number = -2791869625053368023;

		@Final
		private text:string;

		@Final
		private toString:string;

		constructor( text:string ) {
			this.text = text;
			this.toString = "'" + text + "'";
		}

		public getText():string {
			return this.text;
		}

		public  isString():boolean {
			return true;
		}

		public convert( args:Array<any> ):any {
			return this.text;
		}

		public toString():string {
			return this.toString;
		}

	}

	/**
	 * Transformed expression
	 */
	@FinalClass
	export class Transformed extends Element {

		@Final
		private static serialVersionUID:number = 702677732175745567;

		@Final
		private index:number;

		@Final
		@Transient
		private transformer:Function;

		@Final
		private toString:string;

		constructor(
			index:number,
			transformer:Function
		) {
			this.index = index;
			this.transformer = transformer;
			this.toString = index.toString();
		}

		public getIndex():number {
			return this.index;
		}

		// FIXME: test convert method
		public convert( @FinalParameter args:Array<any> ):any {
			return this.transformer.call(null, args[this.index]);
		}

		public isString():boolean {
			return false;
		}

		public toString():string {
			return this.toString;
		}

	}

	/**
	 * Argument by index
	 */
	@FinalClass
	export class ByIndex extends Element {

		@Final
		private static serialVersionUID:number = 4711323946026029998;

		@Final
		private index:number;

		@Final
		private myToString:string;

		constructor( index:number ) {
			this.index = index;
			this.myToString = index.toString();
		}

		public convert( @FinalParameter args:Array<any> ):any {
			let arg = args[this.index];

			// Assume that getType only exists in Expression derivaties
			if (arg.getType && typeof arg.getType === 'getType') {
				if (instanceOfExpression(arg)) {
					return ExpressionUtils.extract(<Expression<any>> arg);
				} else {
					return arg;
				}
			}
		}

		public getIndex():number {
			return this.index;
		}

		public  isString():boolean {
			return false;
		}

		public toString():string {
			return this.myToString;
		}

	}

	/**
	 * Math operation
	 */
	@FinalClass
	export class Operation extends Element {

		@Final
		private static serialVersionUID = 1400801176778801584;

		@Final
		private index1:number;
		@Final
		private index2:number;
		@Final
		private operator:Operator;
		@Final
		private asString:boolean;

		constructor(
			index1:number,
			index2:number,
			operator:Operator,
			asString:boolean
		) {
			this.index1 = index1;
			this.index2 = index2;
			this.operator = operator;
			this.asString = asString;
		}

		public convert( args:Array<any> ):any {
			let arg1 = args[this.index1];
			let arg2 = args[this.index2];
			if (isNumber(arg1) && isNumber(arg2)) {
				return MathUtils.result(asNumber(arg1), asNumber(arg2), this.operator);
			} else {
				let expr1:Expression<any> = asExpression(arg1);
				let expr2:Expression<any> = asExpression(arg2);

				if (typeof arg2 === "number") {
					if (CONVERTIBLES.contains(this.operator) && instanceOfOperation(expr1)) {
						let operation:OperationInterface = <OperationInterface> expr1;
						if (CONVERTIBLES.contains(operation.getOperator()) && instanceOfConstant(operation.getArg(1))) {
							let num1:number = (<Constant<number>> operation.getArg(1)).getConstant();
							let num2:number;
							if (this.operator == operation.getOperator()) {
								num2 = MathUtils.result(num1, <number>arg2, Ops.ADD);
							} else if (operator == Ops.ADD) {
								num2 = MathUtils.result(<number>arg2, num1, Ops.SUB);
							} else {
								num2 = MathUtils.result(num1, <number>arg2, Ops.SUB);
							}
							return ExpressionUtils.operation(expr1.getType(), this.operator,
								operation.getArg(0), Expressions.constant(num2));
						}
					}
				}

				return ExpressionUtils.operation(expr1.getType(), this.operator, expr1, expr2);
			}
		}

		public boolean

		isString() {
			return this.asString;
		}

		public toString():string {
			return this.index1 + " " + this.operator + " " + this.index2;
		}
	}

	/**
	 * Math operation with constant
	 */
	@FinalClass
	export class OperationConst extends Element {

		@Final
		private serialVersionUID = 1400801176778801584;

		@Final
		private index1:number;

		@Final
		private arg2:BigDecimal;

		@Final
		private expr2:Expression<BigDecimal>;

		@Final
		private operator:Operator;

		@Final
		private asString:boolean;

		constructor(
			index1:number,
			arg2:BigDecimal,
			operator:Operator,
			asString:boolean
		) {
			this.index1 = index1;
			this.arg2 = arg2;
			this.expr2 = Expressions.constant(arg2);
			this.operator = operator;
			this.asString = asString;
		}

		public convert( args:Array<any> ):any {
			let arg1 = args[this.index1];

			if (isNumber(arg1)) {
				return MathUtils.result(asNumber(arg1), this.arg2, this.operator);
			} else {
				let expr1:Expression<any> = asExpression(arg1);
				if (CONVERTIBLES.contains(this.operator) && instanceOfOperation(expr1)) {
					let operation:OperationInterface = <OperationInterface>expr1;
					if (CONVERTIBLES.contains(operation.getOperator()) && operation.getArg(1) instanceof Constant) {
						let num1:number = (<Constant<number>>operation.getArg(1)).getConstant();
						let num2:number;
						if (this.operator == operation.getOperator()) {
							num2 = MathUtils.result(num1, this.arg2, Ops.ADD);
						} else if (this.operator == Ops.ADD) {
							num2 = MathUtils.result(this.arg2, num1, Ops.SUB);
						} else {
							num2 = MathUtils.result(num1, this.arg2, Ops.SUB);
						}
						return ExpressionUtils.operation(expr1.getType(), this.operator,
							operation.getArg(0), Expressions.constant(num2));
					}
				}

				return ExpressionUtils.operation(expr1.getType(), this.operator, expr1, this.expr2);
			}
		}

		public isString():boolean {
			return this.asString;
		}

		public toString():string {
			return this.index1 + " " + this.operator + " " + this.arg2;
		}
	}

	var CONVERTIBLES = Immutable.Set<Operator>([Ops.ADD, Ops.SUB]);

	@ImmutableClass
	@FinalClass
	export class Template implements Serializable {

		@Final
		private static serialVersionUID = -1697705745769542204;

		@Final

		@Final
		private elements:Immutable.List<Element>;

		@Final
		private template:string;

		constructor(
			template:string,
			elements:Immutable.List<Element>
		) {
			this.template = template;
			this.elements = elements;
		}

		public getElements():Immutable.List<Element> {
			return this.elements;
		}

		public toString():string {
			return this.template;
		}

		public equals( o:any ):boolean {
			if (o == this) {
				return true;
			} else if (instanceOfTemplate(o)) {
				return (<Template> o).template === this.template;
			} else {
				return false;
			}
		}

		public hashCode():number {
			return hashCode(this.template);
		}

	}

	function asNumber( arg:number ):number {
		if (typeof arg === 'number') {
			return <number> arg;
		} else if (instanceOfConstant(ConstantImpl)) {
			return (<Constant<number>> arg).getConstant();
		} else {
			throw new IllegalArgumentException(arg.toString());
		}
	}

	function isNumber( o:any ):boolean {
		return isANumber(o) || (instanceOfConstant(o)
			&& isANumber((<Constant<number>> o).getConstant()));
	}

	function isANumber( n ) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function asExpression( arg:any ):Expression<any> {
		if (instanceOfExpression(arg)) {
			return ExpressionUtils.extract(<Expression<any>> arg);
		} else {
			return Expressions.constant(arg);
		}
	}
}