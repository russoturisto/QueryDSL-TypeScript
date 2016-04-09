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
import {FinalClass, Final} from "../../../../java/Final";
import {ExpressionBase} from "./ExpressionBase";
import {Constant} from "./Constant";
import {Byte} from "../../../../java/lang/Byte";
import {Short} from "../../../../java/lang/Short";
import {Long} from "../../../../java/lang/Long";
import {Character} from "../../../../java/lang/Character";
import {Integer} from "../../../../java/lang/Integer";
import {ExpressionType} from "./Expression";
import {Long} from "../../../../java/lang/Long";
import {Visitor} from "./Visitor";
import {isInstanceOf, equals} from "../../../../java/lang/Object";
import {instanceOfConstant} from "./TSUtils";

class Constants {

	@Final
	static CHARACTERS:Constant<Character>[] = [];

	@Final
	static BYTES:Constant<Byte>[] = [];

	@Final
	static INTEGERS:Constant<Integer>[] = [];

	@Final
	static LONGS:Constant<Long>[] = [];

	@Final
	static SHORTS:Constant<Short>[] = [];

	@Final
	static NUMBERS:Constant<number>[] = [];

	@Final
	static FALSE:Constant<Boolean> = new ConstantImpl<boolean>(false);

	@Final
	static TRUE:Constant<Boolean> = new ConstantImpl<boolean>(true);

	static init():boolean {
		for (let i = 0; i < ConstantImpl.CACHE_SIZE; i++) {
			Constants.INTEGERS[i] = new ConstantImpl<Integer>(new Integer(i));
			Constants.SHORTS[i] = new ConstantImpl<Short>(new Short(i));
			Constants.BYTES[i] = new ConstantImpl<Byte>(new Byte(i));
			Constants.CHARACTERS[i] = new ConstantImpl<Character>(new Character(String.fromCharCode(i)));
			Constants.LONGS[i] = new ConstantImpl<Long>(new Long(i));
			Constants.NUMBERS[i] = new ConstantImpl<number>(i);
		}
		return true;
	}

	static initialized = Constants.init();
}

/**
 * {@code ConstantImpl} is the default implementation of the {@link Constant} interface
 *
 * @author tiwe
 * @param <T> expression type
 */
@ImmutableClass
@FinalClass
export class ConstantImpl<T> extends ExpressionBase<T> implements Constant<T> {

	@Final
	private static serialVersionUID = -3898138057967814118;

	@Final
	static CACHE_SIZE = 256;

	static create<T>(
		arg:T
	):Constant<T> {
		switch (typeof arg) {
			case 'boolean':
				return arg ? Constants.TRUE : Constants.FALSE;
			case 'string':
				if (arg.length === 1) {
					let charCode = arg.charCodeAt(0);
					if (charCode < ConstantImpl.CACHE_SIZE) {
						return Constants.CHARACTERS[charCode];
					} else {
						return new ConstantImpl<Character>(new Character(arg));
					}
				}
				return new ConstantImpl(arg)
			case 'number':
				if (arg >= 0 && arg < ConstantImpl.CACHE_SIZE) {
					return Constants.NUMBERS[arg];
				} else {
					return new ConstantImpl<number>(arg);
				}
			case 'object':
				if (arg instanceof Byte) {
					if (arg.byte < ConstantImpl.CACHE_SIZE) {
						return Constants.BYTES[arg.byte];
					} else {
						return new ConstantImpl<Byte>(new Byte(arg));
					}
				} else if (arg instanceof Short) {
					if (arg.short < ConstantImpl.CACHE_SIZE) {
						return Constants.SHORTS[arg.short];
					} else {
						return new ConstantImpl<Short>(new Short(arg));
					}
				} else if (arg instanceof Integer) {
					if (arg.integer < ConstantImpl.CACHE_SIZE) {
						return Constants.INTEGERS[arg.integer];
					} else {
						return new ConstantImpl<Integer>(new Integer(arg));
					}
				} else if (arg instanceof Long) {
					if (arg.long < ConstantImpl.CACHE_SIZE) {
						return Constants.LONGS[arg.long];
					} else {
						return new ConstantImpl<Long>(new Long(arg));
					}
				} else if (arg instanceof Character) {
					let charCode = arg.getCharCode();
					if (arg.getCharCode() < ConstantImpl.CACHE_SIZE) {
						return Constants.CHARACTERS[charCode];
					} else {
						return new ConstantImpl<Character>(new Character(arg));
					}
				}
				return new ConstantImpl<T>(arg);
		}

	}

	@Final
	private constant:T;

	/**
	 * Create a new Constant of the given type for the given object
	 *
	 * @param type type of the expression
	 * @param constant constant
	 */
	constructor(
		constant:any
	) {
		super(ExpressionType.CONSTANT);
		this.constant = constant;
	}

	public accept<R, C>(
		v:Visitor<R, C>,
		context:C
	):R {
		return v.visit(this, context);
	}

	public equals( o:any ):boolean {
		if (o == this) {
			return true;
		} else if (instanceOfConstant(o)) {
			return equals((<Constant<any>> o).getConstant(), this.constant);
		} else {
			return false;
		}
	}

	public getConstant():T {
		return this.constant;
	}

}
