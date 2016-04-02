/**
 * Created by Papa on 4/1/2016.
 */

// Nulltable for properties
export function Nullable() {

}

export function NullableMethod() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	};
}