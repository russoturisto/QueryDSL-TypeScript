/**
 * Created by Papa on 6/14/2016.
 */

export class EntityUtils {

	static getObjectClassName(
		object:any
	):string {
		if (typeof object != "object" || object === null) {
			throw `Not an object instance`;
		}
		return this.getClassName(object.constructor);
	}

	static getClassName(
		clazz:Function
	):string {
		if (typeof clazz != "function") {
			throw `Not a constructor function`;
		}

		let className = clazz['name'];
		// let className = /(\w+)\(/.exec(clazz.toString())[1];

		return className;
	}
}