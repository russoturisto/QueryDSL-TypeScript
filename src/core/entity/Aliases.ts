import {IQField} from "../field/Field";
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
/*
 class SpecificColumnAliases {

 private aliasEntries:string[] = [];
 private readIndex = 0;

 constructor(
 private aliasKey:string
 ) {
 }

 addAlias(
 columnAlias:string
 ):void {
 this.aliasEntries.push(columnAlias);
 }

 resetReadIndex():void {
 this.readIndex = 0;
 }

 readNextAlias():string {
 if (this.readIndex >= this.aliasEntries.length) {
 throw `Too many read references for column ${this.aliasKey}`;
 }
 return this.aliasEntries[this.readIndex++];
 }
 }
 */
export class ColumnAliases {
	// numFields:number = 0;
	private lastAlias = [-1, -1, -1];
	private fields: IQField<any>[] = [];
	// private columnAliasMap:{[aliasPropertyCombo:string]:SpecificColumnAliases} = {};

	constructor(
		private aliasPrefix: string = ''
	) {
	}

	/*
	 addAlias(
	 tableAlias:string,
	 propertyName:string
	 ):string {
	 let aliasKey = this.getAliasKey(tableAlias, propertyName);
	 let columnAlias = this.getNextAlias();
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
	 tableAlias:string,
	 propertyName:string
	 ):string {
	 let aliasKey = this.getAliasKey(tableAlias, propertyName);
	 let specificColumnAliases = this.columnAliasMap[aliasKey];
	 if (!specificColumnAliases) {
	 throw `No columns added for ${aliasKey}`;
	 }
	 return specificColumnAliases.readNextAlias();
	 }

	 private getAliasKey(
	 tableAlias:string,
	 propertyName:string
	 ):string {
	 let aliasKey = `${tableAlias}.${propertyName}`;
	 return aliasKey;
	 }
	 */

	getNextAlias( field: IQField<any> ): string {
		if (!this.hasField(field)) {
			this.fields.push(field);
		}
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

	hasField( field: IQField<any> ): boolean {
		return this.fields.some(( memberField ) => {
			return memberField === field;
		});
	}

	clearFields() {
		this.fields = [];
	}
}