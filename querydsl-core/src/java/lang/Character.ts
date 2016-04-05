/**
 * Created by Papa on 4/5/2016.
 */

export class Character {
	constructor(
		public character:string
	){

	}

	getCharCode() {
		return this.character.charCodeAt(0);
	}
}