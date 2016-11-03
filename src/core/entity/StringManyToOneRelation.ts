import {QStringField, IQStringField} from "../field/StringField";
import {IQEntity} from "./Entity";
import {JSONSqlFunctionCall} from "../field/Functions";
import {IQRelation, EntityRelationType, QRelation} from "./Relation";
import {JSONClauseField, JSONClauseObjectType} from "../field/Appliable";
import {JoinType} from "./Joins";
import {FieldColumnAliases} from "./Aliases";
/**
 * Created by Papa on 10/23/2016.
 */

export interface IQStringManyToOneRelation <IQR extends IQEntity, R>
extends IQRelation<IQR, R>, IQStringField {
}

export class QStringManyToOneRelation<IQR extends IQEntity, R>
extends QStringField implements IQRelation<IQR, R> {

	relationType = EntityRelationType.MANY_TO_ONE;

	constructor(
		public q: IQR,
		public qConstructor: new () => IQR,
		public entityName: string,
		public fieldName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQR
	) {
		super(q, qConstructor, entityName, fieldName);
	}

	getInstance():QStringManyToOneRelation<IQR, R> {
		return this.copyFunctions(new QStringManyToOneRelation(this.q, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor));
	}

	innerJoin(): IQR {
		return this.getNewQEntity(JoinType.INNER_JOIN);
	}

	leftJoin(): IQR {
		return this.getNewQEntity(JoinType.LEFT_JOIN);
	}

	private getNewQEntity( joinType: JoinType ): IQR {
		return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, this.q.rootEntityPrefix, QRelation.getNextChildJoinPosition(this.q), this.fieldName, joinType);
	}

	toJSON(): JSONClauseField {
		let json = super.toJSON();
		json.type = JSONClauseObjectType.MANY_TO_ONE_RELATION;

		return json;
	}
}