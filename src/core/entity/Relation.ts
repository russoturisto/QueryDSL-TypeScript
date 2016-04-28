import {IQEntity} from "./Entity";
/**
 * Created by Papa on 4/26/2016.
 */

export interface IQRelation {

	targetEntityConstructor:Function;
	foreignKeyProperty?:string;

}

export class QRelation implements IQRelation {

	constructor(
		public targetEntityConstructor:Function,
		public foreignKeyProperty?:string
	) {

	}

}