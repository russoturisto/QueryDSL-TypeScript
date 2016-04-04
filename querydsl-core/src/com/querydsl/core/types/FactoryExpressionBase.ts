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

import {NullableMethod, Nullable} from "../../../../javax/annotation/Nullable";
import {FactoryExpression} from "./FactoryExpression";
import {ExpressionBase} from "./ExpressionBase";
import {Final} from "../../../../java/Final";
import {Visitor} from "./Visitor";
import {equals} from "../../../../java/lang/Object";
import {ExpressionType, Expression} from "./Expression";
/**
 * Common superclass for {@link FactoryExpression} implementations
 *
 * @param <T>
 */

class FactoryExpressionWrapper<T> extends ExpressionBase<T> implements FactoryExpression<T> {

	@Final
	expr:FactoryExpression<T>;

	constructor(
		expr:FactoryExpression<T>
	) {
		super(expr.getType());
		this.expr = expr;
	}

	getArgs():Array<Expression<any>> {
		return this.expr.getArgs();
	}

	@NullableMethod
	public newInstance( ...args:any[] ):T {
		if (args != null) {
			let foundArg = args.some(( arg ) => {
				if (arg) {
					return true;
				}
			});
			if (foundArg) {
				return this.expr.newInstance(args);
			}
		}
		return null;
	}

	@NullableMethod
	public   accept<R, C>(
		v:Visitor<R, C>,
		@Nullable  context:C
	):R {
		return this.expr.accept(v, context);
	}

	public  equals( o:any ):boolean {
		if (o == this) {
			return true;
		} else if (o instanceof FactoryExpressionWrapper) {
			return equals(this.expr, (<FactoryExpressionWrapper>o).expr);
		} else {
			return false;
		}
	}

}

export abstract class FactoryExpressionBase<T> extends ExpressionBase<T> implements FactoryExpression<T> {

	constructor( type:ExpressionType ) {
		super(type);
	}

	/**
	 * Returns a wrapper expression which returns null if all arguments to newInstance are null
	 *
	 * @return new factory expression with {@code skip nulls} applied
	 */
	public  skipNulls():FactoryExpression<T> {
		return new FactoryExpressionWrapper<T>(this);
	}

	public equals(
		o:any
	):boolean {
		if (o == this) {
			return true;
		} else if (o.getType && o.getType() === ExpressionType.FACTORY_EXPRESSION) {
			let other = <FactoryExpression>o;
			return this.constructor == other.constructor
				&& equals((<FactoryExpression>this).getArgs(), other.getArgs());
		} else {
			return false;
		}
	}

}
