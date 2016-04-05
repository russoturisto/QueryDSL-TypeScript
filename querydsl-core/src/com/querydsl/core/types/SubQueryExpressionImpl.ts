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

import {ExpressionBase} from "./ExpressionBase";
import {SubQueryExpression} from "./SubQueryExpression";
import {ImmutableClass} from "../../../../javax/annotation/concurrent/Immutable";
import {Final, FinalMethod} from "../../../../java/Final";
import {QueryMetadata} from "../QueryMetadata";
import {ExpressionType} from "./Expression";
import {equals} from "../../../../java/lang/Object";
import {Visitor} from "./Visitor";
/**
 * {@code SubQueryExpressionImpl} is the default implementation of the {@link SubQueryExpression} interface
 *
 * @author tiwe
 * @param <T> Result type
 */
@ImmutableClass
export class SubQueryExpressionImpl<T> extends ExpressionBase<T> implements SubQueryExpression<T> {

	@Final
	private static serialVersionUID:number = 6775967804458163;

	@Final
	private metadata:QueryMetadata;

	constructor(
		type:ExpressionType,
		metadata:QueryMetadata
	) {
		super(type);
		this.metadata = metadata;
	}

	@FinalMethod
	public  equals( o:any ):boolean {
		if (o == this) {
			return true;
		} else if (o instanceof SubQueryExpression) {
			let s = <SubQueryExpression<T>> o;
			return equals(s.getMetadata(), this.metadata);
		} else {
			return false;
		}
	}

	@FinalMethod
	public  getMetadata():QueryMetadata {
		return this.metadata;
	}

	@FinalMethod
	public   accept<R, C>(
		v:Visitor<R, C>,
		context:C
	):R {
		return v.visit(this, context);
	}

}
