/**
 * Created by Papa on 10/18/2016.
 */

const ALIASES = ['a', 'b', 'c', 'd', 'e',
	'f', 'g', 'h', 'i', 'j',
	'k', 'l', 'm', 'n', 'o',
	'p', 'q', 'r', 's', 't',
	'u', 'v', 'w', 'x', 'y', 'z'];

export class ColumnAliases {
	numFields: number = 0;
	private lastAlias = [-1, -1];
	private columnAliasMap: {[aliasPropertyCombo: string]: string} = {};

	addAlias(
		tableAlias: string,
		propertyName: string
	): string {
		let aliasKey = this.getAliasKey(tableAlias, propertyName);
		let columnAlias = this.getNextAlias();
		this.columnAliasMap[aliasKey] = columnAlias;
		this.numFields++;

		return columnAlias;
	}

	getAlias(
		tableAlias: string,
		propertyName: string
	): string {
		let aliasKey = this.getAliasKey(tableAlias, propertyName);
		return this.columnAliasMap[aliasKey];
	}

	private getAliasKey(
		tableAlias: string,
		propertyName: string
	): string {
		let aliasKey = `${tableAlias}.${propertyName}`;
		return aliasKey;
	}

	private getNextAlias(): string {
		let currentAlias = this.lastAlias;
		for (var i = 1; i >= 0; i--) {
			let currentIndex = currentAlias[i];
			currentIndex = (currentIndex + 1) % 26;
			currentAlias[i] = currentIndex;
			if (currentIndex !== 0) {
				break;
			}
		}
		let aliasString = '';
		for (var i = 0; i < 2; i++) {
			aliasString += ALIASES[currentAlias[i]];
		}

		return aliasString;
	}
}