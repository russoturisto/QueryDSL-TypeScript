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
import {Operator} from "./Operator";
import {Class} from "../../../../java/lang/Class";

/**
 * {@code PathType} represents the relation of a {@link Path} to its parent
 */
export class PathType implements Operator {
	/**
	 * Indexed array access (array[i])
	 */
	static ARRAYVALUE = 1;

	/**
	 * Indexed array access with constant (array[i])
	 */
	static ARRAYVALUE_CONSTANT = 2;

	/**
	 * Access of any element in a collection
	 */
	static COLLECTION_ANY = 3;

	/**
	 * Delegate to an expression
	 */
	static DELEGATE = 4;

	/**
	 * Indexed list access (list.get(index))
	 */
	static LISTVALUE = 5;

	/**
	 * Indexed list access with constant (list.get(index))
	 */
	static LISTVALUE_CONSTANT = 6;

	/**
	 * Map eq access (map.get(key))
	 */
	static MAPVALUE = 7;

	/**
	 * Map eq access with constant (map.get(key))
	 */
	static MAPVALUE_CONSTANT = 8;

	/**
	 * Property of the parent
	 */
	static PROPERTY = 9;

	/**
	 * Root path
	 */
	static VARIABLE = 10;

	myName:string;

	constructor(
		public pathType:number
	) {
		switch (pathType) {
			case PathType.ARRAYVALUE:
				this.myName = 'ARRAYVALUE';
				break;
			case PathType.ARRAYVALUE_CONSTANT:
				this.myName = 'ARRAYVALUE_CONSTANT';
				break;
			case PathType.COLLECTION_ANY:
				this.myName = 'COLLECTION_ANY';
				break;
			case PathType.DELEGATE:
				this.myName = 'DELEGATE';
				break;
			case PathType.LISTVALUE:
				this.myName = 'LISTVALUE';
				break;
			case PathType.LISTVALUE_CONSTANT:
				this.myName = 'LISTVALUE_CONSTANT';
				break;
			case PathType.MAPVALUE:
				this.myName = 'MAPVALUE';
				break;
			case PathType.MAPVALUE_CONSTANT:
				this.myName = 'MAPVALUE_CONSTANT';
				break;
			case PathType.PROPERTY:
				this.myName = 'PROPERTY';
				break;
			case PathType.VARIABLE:
				this.myName = 'VARIABLE';
				break;
		}
	}

	public name() {
		this.myName;
	}


	public getType():number {
		return this.pathType;
	}

}
