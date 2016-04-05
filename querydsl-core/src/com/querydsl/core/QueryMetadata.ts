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

import {Serializable} from "../../../java/io/Serializable";
import {Expression} from "./types/Expression";
/**
 * {@code QueryMetadata} defines query metadata such as query sources, filtering
 * conditions and the projection
 *
 * @author tiwe
 */
export interface QueryMetadata extends Serializable {

	/**
	 * Add the given group by expressions
	 *
	 * @param o group by expressions
	 */
	addGroupBy( o:Expression<any> ):void;

	/**
	 * Add the given having expressions
	 *
	 * @param o having conditions
	 */
	addHaving( o:Predicate ):void;

	/**
	 * Add the given query join
	 *
	 * @param joinType type of join
	 * @param expr join target
	 */
	addJoin(
		joinType:JoinType,
		expr:Expression<any>
	):void;

	/**
	 * Add the given join flag to the last given join
	 *
	 * @param flag join flag
	 */
	addJoinFlag( flag:JoinFlag ):void;

	/**
	 * Add the given join condition to the last given join
	 *
	 * @param o join condition
	 */
	addJoinCondition( o:Predicate ):void;

	/**
	 * Add the given order specifiers
	 *
	 * @param o order
	 */
	addOrderBy( o:OrderSpecifier<any> ):void;

	/**
	 * Add the given where expressions
	 *
	 * @param o where condition
	 */
	addWhere( o:Predicate ):void;

	/**
	 * Clear the order expressions
	 */
	clearOrderBy():void;

	/**
	 * Clear the where expressions
	 */
	clearWhere():void;

	/**
	 * Clone this QueryMetadata instance
	 *
	 * @return new QueryMetadata instance with cloned state
	 */
	clone():QueryMetadata;

	/**
	 * Get the group by expressions
	 *
	 * @return group by
	 */
	getGroupBy():Array<Expression<any>>;

	/**
	 * Get the having expressions
	 *
	 * @return having condition, or null if none set
	 */
	@Nullable
	getHaving():Predicate;

	/**
	 * Get the query joins
	 *
	 * @return joins
	 */
	getJoins():Array<JoinExpression>;

	/**
	 * Get the QueryModifiers
	 *
	 * @return modifiers
	 */
	getModifiers():QueryModifiers;

	/**
	 * Get the OrderSpecifiers
	 *
	 * @return order by
	 */
	getOrderBy():Array<OrderSpecifier<any>>;

	/**
	 * Get the projection
	 *
	 * @return projection
	 */
	@Nullable
	getProjection():Expression<any>;

	/**
	 * Get the parameter bindings
	 *
	 * @return parameter bindings
	 */
	getParams():Map<ParamExpression<any>, any>;

	/**
	 * Get the expressions aggregated into a single boolean expression or null,
	 * if none where defined
	 *
	 * @return where condition or null, if none set
	 */
	@Nullable
	getWhere():Predicate;

	/**
	 * Get whether the projection is distinct
	 *
	 * @return distinct
	 */
	isDistinct():boolean;

	/**
	 * Get whether the projection is unique
	 *
	 * @return unique
	 */
	isUnique():boolean;

	/**
	 * Reset the projection
	 */
	reset():void;

	/**
	 * Set the distinct flag
	 *
	 * @param distinct distinct
	 */
	setDistinct( distinct:boolean ):void;

	/**
	 * Set the maximum number of rows
	 *
	 * @param limit limit
	 */
	setLimit( @Nullable limit:number ):void;

	/**
	 * Set the query modifiers limit and offset
	 *
	 * @param restriction restriction
	 */
	setModifiers( restriction:QueryModifiers ):void;

	/**
	 * Set the number of skipped rows
	 *
	 * @param offset offset
	 */
	setOffset( @Nullable offset:number ):void;

	/**
	 * Set the unique flag
	 *
	 * @param unique unique
	 */
	setUnique( unique:boolean ):void;

	/**
	 * Bind the value for the given parameter expression
	 *
	 * @param <T> binding type
	 * @param param parameter
	 * @param value binding
	 */
	setParam<T>(
		param:ParamExpression<T>,
		value:T
	):void;

	/**
	 * Set the projection
	 *
	 * @param o projection
	 */
	setProjection( o:Expression<any> ):void;

	/**
	 * Add the given query flag
	 *
	 * @param flag query flag
	 */
	addFlag( flag:QueryFlag ):void;

	/**
	 * Return whether the given query flag is applied
	 *
	 * @param flag query flag
	 * @return true, if present, false, if not
	 */
	hasFlag( flag:QueryFlag ):boolean;

	/**
	 * Remove the given query flag
	 *
	 * @param flag query flag
	 */
	removeFlag( flag:QueryFlag ):void;

	/**
	 * Get all query flags
	 *
	 * @return all used query flags
	 */
	getFlags():Set<QueryFlag> ;

	/**
	 * Set the validate flag
	 *
	 * @param v validate
	 */
	setValidate( v:boolean ):void ;
}
