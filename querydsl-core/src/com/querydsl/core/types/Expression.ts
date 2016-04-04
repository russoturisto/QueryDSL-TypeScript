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

import {Serializable} from "../../../../java/io/Serializable";
import {Class} from "../../../../java/lang/Class";
import {Visitor} from "./Visitor";

export enum ExpressionType {

	CONSTANT,
	FACTORY_EXPRESSION,
	OPERAION,
	PARAM_EXPRESSION,
	PATH,
	SUB_QUERY_EXPRESSION,
	TEMPLATE_EXPRESSION

}

export function getExpressionTypeName(
	expressionType:ExpressionType
):string {

	switch (expressionType) {
		case ExpressionType.CONSTANT:
			return 'CONSTANT';
		case ExpressionType.FACTORY_EXPRESSION:
			return 'FACTORY_EXPRESSION';
		case ExpressionType.OPERAION:
			return 'OPERAION';
		case   ExpressionType.PARAM_EXPRESSION:
			return 'PARAM_EXPRESSION';
		case  ExpressionType.PATH:
			return 'PATH';
		case  ExpressionType.SUB_QUERY_EXPRESSION:
			return 'SUB_QUERY_EXPRESSION';
		case  ExpressionType.TEMPLATE_EXPRESSION:
			return 'TEMPLATE_EXPRESSION';
		default:
			throw `Unknown expression type ${expressionType}`;
	}

}

/**
 * {@code Expression} defines a general typed expression in a Query instance. The generic type parameter
 * is a reference to the type the expression is bound to.
 *
 * <p>The central Expression subinterfaces are</p>
 * <ul>
 *   <li>{@link Constant} - for constants such as Strings, numbers and entity instances</li>
 *   <li>{@link FactoryExpression} - for row based result processing</li>
 *   <li>{@link Operation} - for common supported operations and function calls</li>
 *   <li>{@link ParamExpression} - for bindable query parameters</li>
 *   <li>{@link Path} - for variables, properties and collection member access</li>
 *   <li>{@link SubQueryExpression} - for subqueries</li>
 *   <li>{@link TemplateExpression} - for custom syntax</li>
 * </ul>
 *
 * @author tiwe
 *
 * @param <T> expression type
 *
 */
export interface Expression<T> extends Serializable {

	/**
	 * Accept the visitor with the given context
	 *
	 * @param <R> return type
	 * @param <C> context type
	 * @param v visitor
	 * @param context context of visit
	 * @return result of visit
	 */
	// @NullableMethod() - annotation moved to abstract method in ExpressionBase
	accept<R,C>(
		v:Visitor<R,C>,
		context?:C
	):R;

	/**
	 * Get the java type for this expression
	 *
	 * @return type of expression
	 */

	getType():ExpressionType;

}
