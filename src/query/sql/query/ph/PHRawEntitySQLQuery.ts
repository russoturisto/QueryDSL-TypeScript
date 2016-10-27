import {IEntity} from "../../../../core/entity/Entity";
import {PHRawSQLQuery, PHSQLQuery} from "../../PHSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
	select: IE;
}

export interface PHRawEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
	select: IE;
}

export class PHEntitySQLQuery<IE extends IEntity> implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawEntitySQLQuery<IE>
	) {
	}

	toJSON(): PHJsonEntitySQLQuery<IE> {

		let jsonEntityQuery:PHJsonEntitySQLQuery<IE>;

		return jsonEntityQuery;
	}

}