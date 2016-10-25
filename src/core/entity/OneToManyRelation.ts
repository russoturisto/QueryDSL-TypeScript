import {IQEntity} from "./Entity";
import {IQRelation, EntityRelationType, QRelation} from "./Relation";
import {JoinType} from "./Joins";
/**
 * Created by Papa on 10/25/2016.
 */

export class QOneToManyRelation<IQR extends IQEntity, R, IQ extends IQEntity>
implements IQRelation<IQR, R, IQ> {

	public relationType: EntityRelationType = EntityRelationType.ONE_TO_MANY;

	constructor(
		public q: IQ,
		public qConstructor: new () => IQ,
		public entityName: string,
		public propertyName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQR
	) {
		this.q.addEntityRelation(propertyName, this);
	}

	innerJoin(): IQR {
		return this.getNewQEntity(JoinType.INNER_JOIN);
	}

	leftJoin(): IQR {
		return this.getNewQEntity(JoinType.LEFT_JOIN);
	}

	private getNewQEntity( joinType: JoinType ): IQR {
		return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, QRelation.getNextChildJoinPosition(this.q), this.propertyName, joinType);
	}

}