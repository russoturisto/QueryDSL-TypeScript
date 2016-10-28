import {IEntity, IFrom} from "../../../../core/entity/Entity";
import {PHRawSQLQuery, PHSQLQuery, PHJsonCommonSQLQuery, PHJsonLimitedSQLQuery} from "../../PHSQLQuery";
import {PHMappableSQLQuery} from "./PHMappedSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonEntitySQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
	select: IE;
}

export interface PHRawEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
	from?: IFrom[];
	select: IE;
}

export class PHEntitySQLQuery<IE extends IEntity> extends PHMappableSQLQuery implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawEntitySQLQuery<IE>
	) {
		super();
		this.isEntityQuery = true;
		this.isHierarchicalEntityQuery = true;
	}

	toJSON(): PHJsonEntitySQLQuery<IE> {
		return {
			select: this.selectClauseToJSON(this.phRawQuery.select),
			from: this.fromClauseToJSON(this.phRawQuery.from),
			where: this.whereClauseToJSON(this.phRawQuery.where),
			orderBy: this.orderByClauseToJSON(this.phRawQuery.orderBy)
		};
	}

}

export interface PHJsonLimitedEntitySQLQuery<IE extends IEntity>
extends PHJsonEntitySQLQuery<IE>, PHJsonLimitedSQLQuery {
}

export interface PHRawLimitedEntitySQLQuery<IE extends IEntity> extends PHRawEntitySQLQuery<IE>, PHJsonLimitedSQLQuery {
}

export class PHLimitedEntitySQLQuery<IE extends IEntity> extends PHEntitySQLQuery<IE> {

	constructor(
		public phRawQuery: PHRawLimitedEntitySQLQuery<IE>
	) {
		super(phRawQuery);
		this.isHierarchicalEntityQuery = false;
	}

	toJSON(): PHJsonLimitedEntitySQLQuery<IE> {
		let limitedJsonEntity: PHJsonLimitedEntitySQLQuery<IE> = super.toJSON();
		limitedJsonEntity.limit = this.phRawQuery.limit;
		limitedJsonEntity.offset = this.phRawQuery.offset;

		return limitedJsonEntity;
	}

}