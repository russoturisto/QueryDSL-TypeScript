import {QNumberField, IQNumberField} from "../field/NumberField";
import {IQEntity} from "./Entity";
import {JSONSqlFunctionCall} from "../field/Functions";
import {IQRelation, EntityRelationType, QRelation} from "./Relation";
import {JSONClauseField, JSONClauseObjectType} from "../field/Appliable";
import {JoinType} from "./Joins";
import {ColumnAliases} from "./Aliases";
/**
 * Created by Papa on 10/23/2016.
 */

export interface IQNumberManyToOneRelation <IQR extends IQEntity, R>
extends IQRelation<IQR, R>, IQNumberField {
}

const NUMBER_MANY_TO_ONE_ALIASES = new ColumnAliases('nmp_');
const NUMBER_ENTITY_MANY_TO_ONE_ALIASES = new ColumnAliases('nme_');

export class QNumberManyToOneRelation<IQR extends IQEntity, R extends IQEntity>
extends QNumberField implements IQRelation<IQR, R> {

	relationType = EntityRelationType.MANY_TO_ONE;

	constructor(
		public q: IQR,
		public qConstructor: new () => IQR,
		public entityName: string,
		public fieldName: string,
		public relationEntityConstructor: new () => R,
		public relationQEntityConstructor: new ( ...args: any[] ) => IQR,
	  alias = NUMBER_ENTITY_MANY_TO_ONE_ALIASES.getNextAlias()
	) {
		super(q, qConstructor, entityName, fieldName, alias);
	}

	getInstance():QNumberManyToOneRelation<IQR, R> {
		return new QNumberManyToOneRelation(this.q, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor, NUMBER_MANY_TO_ONE_ALIASES.getNextAlias())
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

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQNumberManyToOneRelation <IQR, R> {
		let appliedMtoRelation = new QNumberManyToOneRelation(this.q, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor);
		appliedMtoRelation.__appliedFunctions__ = appliedMtoRelation.__appliedFunctions__.concat(this.__appliedFunctions__);
		appliedMtoRelation.__appliedFunctions__.push(sqlFunctionCall);

		return appliedMtoRelation;
	}

	toJSON(): JSONClauseField {
		let json = super.toJSON();
		json.type = JSONClauseObjectType.MANY_TO_ONE_RELATION;

		return json;
	}
}