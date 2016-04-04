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

import {ImmutableClass} from "../../../../javax/annotation/concurrent/Immutable";
import {ExpressionBase} from "./ExpressionBase";
import {ParamExpression} from "./ParamExpression";
import {Final, FinalClass, FinalMethod} from "../../../../java/Final";
import {ExpressionType, getExpressionTypeName} from "./Expression";
import {UUID} from "../../../../java/util/UUID";
import {Visitor} from "./Visitor";
/**
 * {@code ParamExpressionImpl} defines a parameter in a query with an optional name
 *
 * @author tiwe
 *
 * @param <T> expression type
 */
@ImmutableClass
export class ParamExpressionImpl<T> extends ExpressionBase<T> implements ParamExpression<T> {

	@Final
	private static serialVersionUID = -6872502615009012503;

	@Final
	private name:string;

	@Final
	private anon:boolean;

	constructor(
		type:ExpressionType,
		name?:string
	) {
		super(type);
		if (name) {
			this.name = name;
			this.anon = false;
		} else {
			this.name = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
			this.anon = true;
		}
	}

	@FinalMethod
	public accept<R,C>(
		v:Visitor<R,C>,
		context:C
	):R {
		return v.visit(this, context);
	}

	@FinalMethod
	public equals( o:any ):boolean {
		if (o == this) {
			return true;
		} else if (o.getType && o.getType() === ExpressionType.PARAM_EXPRESSION) {
			let other = <ParamExpression> o;
			return other.constructor === this.constructor
				&& other.getName() === this.name
				&& other.isAnon() == this.anon;
		} else {
			return false;
		}
	}

	@FinalMethod
	public getName():string {
		return this.name;
	}

	@FinalMethod
	public isAnon():boolean {
		return this.anon;
	}

	@FinalMethod
	public getNotSetMessage():string {
		if (!this.anon) {
			return "The parameter " + name + " needs to be set";
		} else {
			return "A parameter of type " + getExpressionTypeName(this.getType()) + " was not set";
		}
	}
}
