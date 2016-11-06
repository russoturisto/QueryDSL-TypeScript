import {IQField, QField} from "../field/Field";
import {IQEntity} from "./Entity";
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

export abstract class AliasMap<T> {
	protected aliasMap: Map<T, string> = new Map<T, string>();

	constructor(
		private aliasCache: AliasCache
	) {
	}

	getNextAlias( object: T ): string {
		if (!this.hasAliasFor(object)) {
			return this.getExistingAlias(object);
		}
		let aliasString = this.aliasCache.getFollowingAlias();
		this.aliasMap.set(object, aliasString);

		return aliasString;
	}

	abstract getExistingAlias( object: T ): string;

	hasAliasFor( object: T ): boolean {
		return this.aliasMap.has(object);
	}

}

export class EntityAliases extends AliasMap<IQEntity> {

	constructor(
		private entityAliasCache = new AliasCache(),
		private columnAliasCache = new AliasCache()
	) {
		super(entityAliasCache);
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

export class FieldColumnAliases extends AliasMap<IQField<any>> {

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