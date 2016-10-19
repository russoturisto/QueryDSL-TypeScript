import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {RelationRecord, JSONRelation} from "../../core/entity/Relation";
import {JSONLogicalOperation} from "../../core/operation/LogicalOperation";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {PHQuery, PHRawQuery} from "../PHQuery";
import {JSONFieldInOrderBy} from "../../core/field/FieldInOrderBy";
import {JSONClauseObject} from "../../core/field/Field";
/**
 * Created by Papa on 8/12/2016.
 */

export interface PHRawSQLQuery<IE extends IEntity> extends PHRawQuery<IE> {
	select: IE;
	from?: IQEntity[];
	where?: JSONBaseOperation;
}

export interface PHJsonFlatSQLQuery extends PHJsonCommonSQLQuery {
	select?: JSONClauseObject[];
	groupBy: any;
	having: any;
}

export interface PHJsonObjectSQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
	select: IE;
}

export interface PHJsonCommonSQLQuery {
	from?: JSONRelation[];
	where?: JSONBaseOperation;
	orderBy?: JSONFieldInOrderBy[];
}


export enum JoinType {
	FULL_JOIN,
	INNER_JOIN,
	LEFT_JOIN,
	RIGHT_JOIN
}

export class PHSQLQuery<IE extends IEntity> implements PHQuery<IE> {

	constructor(
		public phRawQuery: PHRawSQLQuery<IE>,
		public qEntity: QEntity<any>,
		public qEntityMap: {[entityName: string]: QEntity<any>},
		public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		public entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	) {
	}

	toSQL(): PHJsonCommonSQLQuery<IE> {
		let phJoin: JSONRelation[] = [];
		this.phRawQuery.from.forEach((iEntity:IQEntity) => {
			phJoin.push(iEntity.getRelationJson());
		});

		return {
			select: this.phRawQuery.select,
			from: phJoin,
			where: this.phRawQuery.where
		};
	}

}