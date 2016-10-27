import {QOperableField} from "../field/Field";
import {QManyToOneRelation} from "../entity/Relation";
/**
 * Created by Papa on 6/14/2016.
 */

export class EntityUtils {

	static getObjectClassName(
		object: any
	): string {
		if (typeof object != "object" || object === null) {
			throw `Not an object instance`;
		}
		return this.getClassName(object.constructor);
	}

	static getClassName(
		clazz: Function
	): string {
		if (typeof clazz != "function") {
			throw `Not a constructor function`;
		}

		let className = clazz['name'];
		// let className = /(\w+)\(/.exec(clazz.toString())[1];

		return className;
	}

	static exists(
		object: any
	) {
		return object !== null && object !== undefined;
	}

	static isBlank(
		object: any
	) {
		for (let propertyName in object) {
			let property = object[propertyName];
			if (this.exists(property)) {
				if (property instanceof Array && property.length > 0) {
					return false;
				} else {
					return false;
				}
			}
		}
		return true;
	}
}

export function isAppliable( object: any ): boolean {

	return object instanceof QOperableField
		|| object instanceof QManyToOneRelation;

}