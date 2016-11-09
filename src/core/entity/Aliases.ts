import {IQField, QField} from "../field/Field";
import {IQEntity} from "./Entity";
import {IQFunction} from "../field/OperableField";
/**
 * Created by Papa on 10/18/2016.
 */

const ALIASES = ['a', 'b', 'c', 'd', 'e',
	'f', 'g', 'h', 'i', 'j',
	'k', 'l', 'm', 'n', 'o',
	'p', 'q', 'r', 's', 't',
	'u', 'v', 'w', 'x', 'y', 'z'];

export class AliasCache {

	private lastAlias;

	constructor( protected aliasPrefix = '' ) {
		this.reset();
	}

	getFollowingAlias(): string {
		let currentAlias = this.lastAlias;
		for (var i = 2; i >= 0; i--) {
			let currentIndex = currentAlias[i];
			currentIndex = (currentIndex + 1) % 26;
			currentAlias[i] = currentIndex;
			if (currentIndex !== 0) {
				break;
			}
		}
		let aliasString = this.aliasPrefix;
		for (var i = 0; i < 3; i++) {
			aliasString += ALIASES[currentAlias[i]];
		}

		return aliasString;
	}

	reset() {
		this.lastAlias = [-1, -1, -1];
	}
}

export interface Parameter {
	alias: string;
	type: string;
	value: boolean | Date | number | string;
}

export abstract class AliasMap<T, A> {
	protected aliasMap: Map<T, A> = new Map<T, A>();

	constructor(
		protected aliasCache: AliasCache
	) {
	}

	getNextAlias(
		object: T
	): string {
		if (!this.hasAliasFor(object)) {
			return <string><any>this.getExistingAlias(object);
		}
		let aliasString = this.aliasCache.getFollowingAlias();
		this.aliasMap.set(object, <A><any>aliasString);

		return aliasString;
	}

	abstract getExistingAlias( object: T ): A;

	hasAliasFor( object: T ): boolean {
		return this.aliasMap.has(object);
	}

}

export class EntityAliases extends AliasMap<IQEntity, string> {

	private parameterAliases;

	constructor(
		entityAliasCache = new AliasCache('E'),
		private columnAliasCache = new AliasCache('C'),
		parameterAliasCache = new AliasCache('P')
	) {
		super(entityAliasCache);
		this.parameterAliases = new ParameterAliases(parameterAliasCache);
	}

	getParams(): ParameterAliases {
		return this.parameterAliases;
	}

	getNewFieldColumnAliases(): FieldColumnAliases {
		return new FieldColumnAliases(this, this.columnAliasCache);
	}

	getExistingAlias( entity: IQEntity ): string {
		if (!this.hasAliasFor(entity)) {
			throw `No alias found for entity ${entity.__entityName__}`;
		}
		return this.aliasMap.get(entity);
	}

}

export class ParameterAliases extends AliasMap<IQFunction<any>, Parameter> {

	constructor(
		aliasCache: AliasCache
	) {
		super(aliasCache);
	}

	getNextAlias(
		object: IQFunction<any>
	): string {
		if (!this.hasAliasFor(object)) {
			return this.getExistingAlias(object).alias;
		}
		let aliasString = this.aliasCache.getFollowingAlias();
		let parameter: Parameter = {
			alias: aliasString,
			type: typeof object.value,
			value: object.value
		};
		this.aliasMap.set(object, parameter);

		return aliasString;
	}

	getExistingAlias( field: IQFunction<any> ): Parameter {
		if (!this.hasAliasFor(field)) {
			throw `No alias found for a parameter`;
		}
		return this.aliasMap.get(field);
	}

}

export class FieldColumnAliases extends AliasMap<IQField<any>, string> {

	constructor(
		protected _entityAliases: EntityAliases,
		aliasCache: AliasCache
	) {
		super(aliasCache);
	}

	get entityAliases() {
		return this._entityAliases
	}

	getExistingAlias( field: IQField<any> ): string {
		if (!this.hasAliasFor(field)) {
			throw `No alias found for field ${(<QField<any>>field).entityName}.${(<QField<any>>field).fieldName}`;
		}
		return this.aliasMap.get(field);
	}

}