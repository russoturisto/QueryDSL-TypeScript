import {IQField, QField} from "../field/Field";
/**
 * Created by Papa on 10/18/2016.
 */

function test<A>( a: A ): A {
	return a;
}

let a = test({
	b: 1,
	c: 2
});

const ALIASES = ['a', 'b', 'c', 'd', 'e',
	'f', 'g', 'h', 'i', 'j',
	'k', 'l', 'm', 'n', 'o',
	'p', 'q', 'r', 's', 't',
	'u', 'v', 'w', 'x', 'y', 'z'];


const lastRootEntityName = [-1, -1, -1];

export function getNextRootEntityName(): string {
	let currentName = this.lastRootEntityName;
	for (var i = 2; i >= 0; i--) {
		let currentIndex = currentName[i];
		currentIndex = (currentIndex + 1) % 26;
		currentName[i] = currentIndex;
		if (currentIndex !== 0) {
			break;
		}
	}
	let nameString = '';
	for (var i = 0; i < 3; i++) {
		nameString += ALIASES[currentName[i]];
	}

	return nameString;
}

class SpecificColumnAliases {

	private aliasEntries: string[] = [];
	private readIndex = 0;

	constructor(
		private aliasKey: string
	) {
	}

	addAlias(
		columnAlias: string
	): void {
		this.aliasEntries.push(columnAlias);
	}

	resetReadIndex(): void {
		this.readIndex = 0;
	}

	readNextAlias(): string {
		if (this.readIndex >= this.aliasEntries.length) {
			throw `Too many read references for column ${this.aliasKey}`;
		}
		return this.aliasEntries[this.readIndex++];
	}

}

export class ColumnAliases {

	private lastAlias = [-1, -1, -1];
	protected aliasPrefix = '';

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

}

export class EntityColumnAliases extends ColumnAliases {
	private columnAliasMap: {[aliasPropertyCombo: string]: SpecificColumnAliases} = {};
	numFields: number = 0;

	addAlias(
		tableAlias: string,
		propertyName: string
	): string {
		let aliasKey = this.getAliasKey(tableAlias, propertyName);
		let columnAlias = this.getFollowingAlias();
		let specificColumnAliases = this.columnAliasMap[aliasKey];
		if (!specificColumnAliases) {
			specificColumnAliases = new SpecificColumnAliases(aliasKey);
			this.columnAliasMap[aliasKey] = specificColumnAliases;
		}
		specificColumnAliases.addAlias(columnAlias);
		this.numFields++;

		return columnAlias;
	}

	resetReadIndexes() {
		for (let aliasKey in this.columnAliasMap) {
			this.columnAliasMap[aliasKey].resetReadIndex();
		}
	}

	getAlias(
		tableAlias: string,
		propertyName: string
	): string {
		let aliasKey = this.getAliasKey(tableAlias, propertyName);
		let specificColumnAliases = this.columnAliasMap[aliasKey];
		if (!specificColumnAliases) {
			throw `No columns added for ${aliasKey}`;
		}
		return specificColumnAliases.readNextAlias();
	}

	private getAliasKey(
		tableAlias: string,
		propertyName: string
	): string {
		let aliasKey = `${tableAlias}.${propertyName}`;
		return aliasKey;
	}
}

export class FieldColumnAliases extends ColumnAliases {
	private aliasMap: Map<IQField<any>, string> = new Map<IQField<any>, string>();

	getNextAlias( field: IQField<any> ): string {
		if (!this.hasField(field)) {
			return this.getExistingAlias(field);
		}
		let aliasString = this.getFollowingAlias();
		this.aliasMap.set(field, aliasString);

		return aliasString;
	}

	getExistingAlias( field: IQField<any> ): string {
		return this.aliasMap.get(field);
	}

	hasField( field: IQField<any> ): boolean {
		return this.aliasMap.has(field);
	}

	clearFields() {
		this.aliasMap.clear();
	}
}