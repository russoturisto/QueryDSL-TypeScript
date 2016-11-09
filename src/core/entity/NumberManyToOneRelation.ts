import {QNumberField, IQNumberField} from "../field/NumberField";
import {IQEntity, IEntityRelationFrom} from "./Entity";
import {IQRelation, EntityRelationType, QRelation} from "./Relation";
import {JSONClauseObjectType} from "../field/Appliable";
import {JoinType} from "./Joins";
/**
 * Created by Papa on 10/23/2016.
 */

export interface IQNumberManyToOneRelation <IQR extends IQEntity, R>
extends IQRelation, IQNumberField {
}

export class QNumberManyToOneRelation<IERF extends IEntityRelationFrom, R extends IQEntity>
extends QNumberField implements IQRelation {

	relationType = EntityRelationType.MANY_TO_ONE;

	constructor(
		public q: IQEntity,
		public qConstructor: new () => IQEntity,
		public entityName: string,
		public fieldName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQEntity
	) {
		super(q, qConstructor, entityName, fieldName, JSONClauseObjectType.MANY_TO_ONE_RELATION);
	}

	getInstance( qEntity: IQEntity = this.q ): QNumberManyToOneRelation<IERF, R> {
		let relation = new QNumberManyToOneRelation<IERF, R>(qEntity, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor);
		return this.copyFunctions(relation);
	}

	innerJoin(): IERF {
		return this.getNewQEntity(JoinType.INNER_JOIN);
	}

	leftJoin(): IERF {
		return this.getNewQEntity(JoinType.LEFT_JOIN);
	}

	private getNewQEntity( joinType: JoinType ): IERF {
		let newQEntity:IQEntity = new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, QRelation.getNextChildJoinPosition(this.q), this.fieldName, joinType);
		newQEntity.parentJoinEntity = this.q;
		return <IERF><any>newQEntity;
	}

}