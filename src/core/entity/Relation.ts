import {IQEntity, QEntity} from "./Entity";
import {QueryFragment} from "../QueryFragment";
/**
 * Created by Papa on 4/26/2016.
 */

export enum RelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export interface IQRelation<IQR extends IQEntity<IQR>, R, IQ extends IQEntity<IQ>> {

	owningQEntity:IQ;
	relationPropertyName:string;
	relationType:RelationType;
	relationEntityConstructor: new () => R;
	relationQEntityConstructor: new () => IQR;

}

export class QRelation<QR extends QEntity<QR>, R, Q extends QEntity<Q>> extends QueryFragment implements IQRelation<QR, R, Q> {

	constructor(
		public owningQEntity:Q,
		public relationPropertyName:string,
	  public relationType:RelationType,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new () => QR
	) {
		super();
		owningQEntity.addEntityRelation(this);
	}

}