import {IQEntity} from "../../core/entity/Entity";
import {PHRawDelete, PHDelete} from "../PHQuery";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {JSONEntityRelation} from "../../core/entity/Relation";
import {PHAbstractSQLQuery} from "./query/ph/PHAbstractSQLQuery";
/**
 * Created by Papa on 10/2/2016.
 */

export interface PHRawSQLDelete<IQE extends IQEntity> extends PHRawDelete<IQE> {
	deleteFrom: IQE;
	where?: JSONBaseOperation;
}

export interface PHJsonSQLDelete {
	deleteFrom: JSONEntityRelation;
	where?: JSONBaseOperation;
}

export class PHSQLDelete<IQE extends IQEntity> extends PHAbstractSQLQuery implements PHDelete<IQE> {

	constructor(
		public phRawQuery: PHRawSQLDelete<IQE>
	) {
		super();
	}

	toSQL(): PHJsonSQLDelete {
		return {
			deleteFrom: <JSONEntityRelation>this.phRawQuery.deleteFrom.getRelationJson(),
			where: PHAbstractSQLQuery.whereClauseToJSON(this.phRawQuery.where)
		};
	}
}
