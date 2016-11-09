import {IQEntity, IEntityRelationFrom} from "./Entity";
import {IQRelation, EntityRelationType, QRelation} from "./Relation";
import {JoinType} from "./Joins";
/**
 * Created by Papa on 10/25/2016.
 */

export class QOneToManyRelation<IERF extends IEntityRelationFrom, R>
implements IQRelation {

	public relationType: EntityRelationType = EntityRelationType.ONE_TO_MANY;

	constructor(
		public q: IQEntity,
		public qConstructor: new () => IQEntity,
		public entityName: string,
		public propertyName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQEntity
	) {
		this.q.addEntityRelation(propertyName, this);
	}

	innerJoin(): IERF {
		return this.getNewQEntity(JoinType.INNER_JOIN);
	}

	leftJoin(): IERF {
		return this.getNewQEntity(JoinType.LEFT_JOIN);
	}

	private getNewQEntity( joinType: JoinType ): IERF {
		let newQEntity:IQEntity =  new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, QRelation.getNextChildJoinPosition(this.q), this.propertyName, joinType);
		newQEntity.parentJoinEntity = this.q;
		return <IERF><any>newQEntity;
	}

}