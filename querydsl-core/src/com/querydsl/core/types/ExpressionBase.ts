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

import {Expression, ExpressionType} from "./Expression";
import {Final} from "../../../../java/Final";
import {Transient} from "../../../../java/Transient";
import {Visitor} from "./Visitor";
import {NullableMethod, Nullable} from "../../../../javax/annotation/Nullable";
import {HashCodeVisitor} from "./HashCodeVisitor";
/**
 * {@code ExpressionBase} is the base class for immutable {@link Expression} implementations
 *
 * @author tiwe
 *
 * @param <T> expression type
 */
export abstract class ExpressionBase<T> implements Expression<T> {

	static serialVersionUID:number = -8862014178653364345;

	@Final
	private type:ExpressionType;

	@Transient
	@Nullable
	private toString:string;

	@Transient
	@Nullable
	private myHashCode:number;

	constructor(
		type:ExpressionType
	) {
		this.type = type;
	}


	@NullableMethod()
	abstract accept<R,C>(
		v:Visitor<R,C>,
		context?:C
	):R;

	getType<A extends T>():ExpressionType {
		return this.type;
	}

	hashCode():number {
		if (!this.myHashCode) {
			this.myHashCode = this.accept(HashCodeVisitor.DEFAULT);
		}
		return this.myHashCode;
	}

	toString():string {
		if (!this.toString) {
			this.toString = accept(ToStringVisitor.DEFAULT, Templates.DEFAULT);
		}
		return this.toString;
	}

}
