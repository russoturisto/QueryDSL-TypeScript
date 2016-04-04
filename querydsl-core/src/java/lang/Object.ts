/**
 * Created by Papa on 4/2/2016.
 */

function objectHashCode(
	object:any //
):number {
	let hash:number = 0;
	for (let propertyName in object) {
		let property = this[propertyName];
		hash += hashCode(property);
		hash = 31 * hash;
	}
	return hash;
}

function stringHashCode(
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

export function hashCode(
	object:any
):number {
	if(object && object.hashCode && typeof object.hashCode === 'function') {
		let hashCode = object.hashCode();
		return hashCode;
	}
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
			return stringHashCode(object);
			break;
		case 'object':
			if (!object) {
				return 0;
			}
			return objectHashCode(object);
	}
}

function objectEquals(
	object1:any,
	object2:any
):boolean {
	if(typeof object1 !== typeof object2) {
		throw `'typeof object1' is '${typeof object1} but 'typeof object2' is '${typeof object2}'.`;
	}
	if(typeof object1 !== 'object') {
		throw `Expecting 'typeof object1 & object2' to be 'object', got ${typeof object1}`;
	}
	if (this === object1) {
		return true;
	}
	if (object1 === null || typeof object1 !== typeof object2) {
		return false;
	}
	for (let propertyName in object1) {
		let object1Property = object1[propertyName];
		let object2Property = object2[propertyName];
		if (!equals(object1Property, object2Property)) {
			return false;
		}
	}
	return true;
}


export function equals(
	object1:any,
	object2:any
):boolean {
	if(object1 && typeof object1 !== 'function' && object1.equals && typeof object1.equals === 'function') {
		let doesEqual = object1.equals(object2);
		return doesEqual;
	}
	if (object1 === object2) {
		return true;
	}
	if (!object1) {
		if (!object2) {
			return true;
		}
		return false;
	} else if (!object2) {
		if (!object1) {
			return true;
		}
		return false;
	} else
	// both Object1 and Object 2 exist
	{
		if (typeof object1 !== typeof object2) {
			return false;
		}
		switch (typeof object1) {
			case 'undefined':
				// Nothing to add
				return true;
			case 'number':
				if (isNaN(object1)) {
					if (isNaN(object2)) {
						return true;
					}
					return false;
				} else {
					return object1 === object2;
				}
				break;
			case 'boolean':
			case 'function':
			case 'string':
			case 'symbol':
				return object1 == object2;
				break;
			case 'object':
				return objectEquals(object1, object2);
			default:
				throw `Unkown typeof objects ${typeof object1}`;
		}
	}
}


