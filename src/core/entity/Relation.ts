import {IQEntity} from "./Entity";
/**
 * Created by Papa on 4/26/2016.
 */

export enum QRelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export interface IQRelation<IQR extends IQEntity<IQR>> {

	relationPropertyName:string;
	relationType:QRelationType;
	targetEntityConstructor:Function;
	targetQEntity:IQR;
}

export class QRelation<IQR extends IQEntity<IQR>> implements IQRelation<IQR> {

	constructor(
		public relationPropertyName:string,
	  public relationType:QRelationType,
		public targetEntityConstructor:Function,
		public targetQEntity:IQR
	) {
	}

}