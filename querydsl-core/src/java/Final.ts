/**
 * Created by Papa on 4/1/2016.
 */
import "reflect-metadata";

// Final for properties
export function Final() {
	return null;
}

export function FinalClass(constructor: Function) {
}

export function FinalMethod() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	};
}