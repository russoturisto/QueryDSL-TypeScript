/**
 * Created by Papa on 4/2/2016.
 */


export function getObjectHashCode(
	object:any //
):number {
	let hash:number = 0;
	for (let propertyName in this) {
		let property = this[propertyName];
		hash += JObject.getHashCode(property);
		hash = 31 * hash;
	}
	return hash;
}

export function getHashCode(
		object:any
	):number {
		switch (typeof object) {
			case 'function':
			case 'symbol':
			case 'undefined':
				// Nothing to add
				return 0;
			case 'number':
				if (isNaN(object)) {
					return 0;
				} else {
					return object;
				}
				break;
			case 'boolean':
				return (object) ? 1 : 0;
				break;
			case 'string':
				return JObject.stringHashCode(object);
				break;
			case 'object':
				if (!object) {
					return 0;
				}
				return getObjectHashCode(object);
		}
	}

export function stringHashCode(
		s:string
	):number {
		let hash:number = 0,
			strlen:number = s.length,
			i:number,
			c:number;
		if (strlen === 0) {
			return hash;
		}
		for (i = 0; i < strlen; i++) {
			c = s.charCodeAt(i);
			hash = (hash << 5) - hash;
			hash += c;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}

export function equals(
	a:any,
	b:any
):boolean {
	return false;
}

export function objectEquals(
		object1:any,
		object2:any
	):boolean {
		if (this === object1) {
			return true;
		}
		if (object1 === null || typeof object1 !== typeof object2) {
			return false;
		}
		for (let propertyName in object1) {
			let object1Property = object1[propertyName];
			let object2Property = object2[propertyName];
			if (!equalsProperty(object1Property, object2Property)) {
				return false;
			}
		}
		return true;
	}

export function equalsProperty(
		object1:any,
		object2:any
	):boolean {
		if (object1 && !object2) {
			return false;
		}
		if (object2 && !object1) {
			return false;
		}
		if (object1) {
					return false;
				}
				if (typeof propEqualsMethod !== 'function') {
					if (propEqualsMethod !== otherPropEqualsMethod) {
						return false;
					}
				} else {
					if (!object1['equals'](object2)) {
						return false;
					}
				}
			} else {
				if (object1 !== object2) {
					return false;
				}
			}
		} else {
			return true;
		}
	}

	equals(
		object:JObject
	):boolean {
		if (this === object) {
			return true;
		}
		if (object === null || typeof object !== typeof this) {
			return false;
		}
		for (let propertyName in this) {
			let property = this[propertyName];
			let otherProperty = object[propertyName];

		}
	}
