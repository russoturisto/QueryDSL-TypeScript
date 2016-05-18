import {IQEntity} from "./Entity";
/**
 * Created by Papa on 4/26/2016.
 */

export enum QRelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export interface IQRelation {

	targetEntityConstructor:Function;
	relationPropertyName:string;
	relationType:QRelationType;
}

export class QRelation implements IQRelation {

	constructor(
		public targetEntityConstructor:Function,
		public relationPropertyName:string,
	  public relationType:QRelationType
	) {

	}

}