import {IEntity, IQEntity, QEntity} from "../../core/entity/Entity";
import {PHRawUpdate, PHUpdate} from "../PHQuery";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {JSONEntityRelation} from "../../core/entity/Relation";
import {PHAbstractSQLQuery} from "./query/ph/PHAbstractSQLQuery";
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

	toSQL(): PHJsonSQLUpdate<IE> {
		return {
			update: <JSONEntityRelation>this.phRawQuery.update.getRelationJson(),
			set: this.phRawQuery.set,
			where: PHAbstractSQLQuery.whereClauseToJSON(this.phRawQuery.where)
		};
	}
}