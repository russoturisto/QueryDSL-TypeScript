import {IQEntity, QEntity} from "./Entity";
/**
 * Created by Papa on 4/26/2016.
 */

export interface RelationRecord {

	entityName:string;
	foreignKey:string;
	mappedBy:string;
	propertyName:string;
	relationType:RelationType;

}

export enum RelationType {
	ONE_TO_MANY,
	MANY_TO_ONE
}

export interface IQRelation<IQR extends IQEntity, R, IQ extends IQEntity> {

	q:IQ;
	qConstructor:new () => IQ,
	propertyName:string;
	relationPropertyName:string;
	relationType:RelationType;
	relationEntityConstructor:new () => R;
	relationQEntityConstructor:new () => IQR;

}

export class QRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {

	constructor(
		public q:IQ,
		public qConstructor:new () => IQ,
		public relationType:RelationType,
		public propertyName:string,
		public relationPropertyName:string,
		public relationEntityConstructor:new () => R,
		public relationQEntityConstructor:new () => IQR
	) {
		this.q.addEntityRelation(this);
	}

}