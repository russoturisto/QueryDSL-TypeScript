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

	q:IQ;
	qConstructor:new () => IQ,
	relationPropertyName:string;
	relationType:RelationType;
	relationEntityConstructor:new () => R;
	relationQEntityConstructor:new () => IQR;

}

export class QRelation<IQR extends IQEntity<IQR>, R, IQ extends IQEntity<IQ>> extends QueryFragment implements IQRelation<IQR, R, IQ> {

	constructor(
		public q:IQ,
		public qConstructor:new () => IQ,
		public relationType:RelationType,
		public relationPropertyName:string,
		public relationEntityConstructor:new () => R,
		public relationQEntityConstructor:new () => IQR
	) {
		super();
		this.q.addEntityRelation(this);
	}

}