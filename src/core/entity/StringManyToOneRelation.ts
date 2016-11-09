import {QStringField, IQStringField} from "../field/StringField";
import {IQEntity, IEntityRelationFrom} from "./Entity";
import {JSONSqlFunctionCall} from "../field/Functions";
import {IQRelation, EntityRelationType, QRelation} from "./Relation";
import {JSONClauseField, JSONClauseObjectType} from "../field/Appliable";
import {JoinType} from "./Joins";
import {FieldColumnAliases} from "./Aliases";
/**
 * Created by Papa on 10/23/2016.
 */

export interface IQStringManyToOneRelation <IQR extends IQEntity, R>
extends IQRelation, IQStringField {
}

export class QStringManyToOneRelation<IERF extends IEntityRelationFrom, R>
extends QStringField implements IQRelation {

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

	getInstance( qEntity: IQEntity = this.q ): QStringManyToOneRelation<IERF, R> {
		return this.copyFunctions(new QStringManyToOneRelation<IERF, R>(qEntity, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor));
	}

	innerJoin(): IERF {
		return this.getNewQEntity(JoinType.INNER_JOIN);
	}

	leftJoin(): IERF {
		return this.getNewQEntity(JoinType.LEFT_JOIN);
	}

	private getNewQEntity( joinType: JoinType ): IERF {
		let newQEntity = new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, QRelation.getNextChildJoinPosition(this.q), this.fieldName, joinType);
		newQEntity.parentJoinEntity = this.q;
		return <IERF><any>newQEntity;
	}

}