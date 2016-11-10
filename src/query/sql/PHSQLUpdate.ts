import {IEntity, IQEntity, QEntity} from "../../core/entity/Entity";
import {PHRawUpdate, PHUpdate} from "../PHQuery";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {JSONEntityRelation} from "../../core/entity/Relation";
import {PHAbstractSQLQuery} from "./query/ph/PHAbstractSQLQuery";
import {QOperableField} from "../../core/field/OperableField";
import {QField} from "../../core/field/Field";
import {EntityAliases, FieldColumnAliases} from "../../core/entity/Aliases";
/**
 * Created by Papa on 10/2/2016.
 */

export interface PHRawSQLUpdate<IE extends IEntity, IQE extends IQEntity> extends PHRawUpdate<IE> {
	update: IQE;
	set: IE;
	where?: JSONBaseOperation;
}

export interface PHJsonSQLUpdate<IE extends IEntity> {
	update: JSONEntityRelation;
	set: IE;
	where?: JSONBaseOperation;
}

export class PHSQLUpdate<IE extends IEntity, IQE extends IQEntity> extends PHAbstractSQLQuery implements PHUpdate<IE> {

	constructor(
		public phRawQuery: PHRawSQLUpdate<IE, IQE>
	) {
		super();
	}

	toJSON(): PHJsonSQLUpdate<IE> {
		return {
			update: <JSONEntityRelation>this.phRawQuery.update.getRelationJson(this.columnAliases),
			set: this.setToJSON(this.phRawQuery.set),
			where: PHAbstractSQLQuery.whereClauseToJSON(this.phRawQuery.where, this.columnAliases)
		};
	}

	setToJSON( set: any ) {
		for (let propertyName in set) {
			let value = set[propertyName];
			if (value === undefined) {
				continue;
			}
			value = QOperableField.wrapPrimitive(value);
			set[propertyName] = (<QField<any>>value).toJSON(this.columnAliases, false);
		}
		return set;
	}

}