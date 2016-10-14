/**
 * Created by Papa on 10/14/2016.
 */

export class MappedEntityArray<E> extends Array {

	dataMap: {[id: string]: E} = {};

	constructor( private keyField: string | number ) {
		super();
	}

	clear() {
		this.dataMap = {};
		this.splice(0, this.length);
	}

	putAll( values: E[] ): void {
		values.forEach(( value ) => {
			this.put(value);
		});
	}

	put( value: E ): E {
		let keyValue = value[this.keyField];
		if (!keyValue && keyValue != 0) {
			throw `Key field ${this.keyField} is not defined`;
		}
		if(this.dataMap[keyValue]) {
			if(this.dataMap[keyValue] !== value) {
				throw `Found two different instances of an object with the same @Id: ${keyValue}`;
			}
			return value;
		}
		this.dataMap[keyValue] = value;
		this.push(value);

		return null;
	}

	get( key: string | number ): E {
		return this.dataMap[key];
	}

	delete( key: string | number ): E {
		let value = this.dataMap[key];
		delete this.dataMap[key];

		for (let i = this.length - 1; i >= 0; i--) {
			let currentValue = this[i];
			if (currentValue === value) {
				this.splice(i, 1);
				break;
			}
		}

		return value;
	}

	toArray():E[] {
		return this.slice();
	}

}