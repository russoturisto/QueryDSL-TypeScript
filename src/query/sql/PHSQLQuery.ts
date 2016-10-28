import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {EntityRelationRecord, JSONEntityRelation, JSONRelation} from "../../core/entity/Relation";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {PHQuery, PHRawQuery} from "../PHQuery";
import {JSONFieldInOrderBy, IFieldInOrderBy} from "../../core/field/FieldInOrderBy";
import {JSONClauseObject} from "../../core/field/Appliable";
import {isAppliable} from "../../core/utils/EntityUtils";
/**
 * Created by Papa on 8/12/2016.
 */

export interface PHRawSQLQuery extends PHRawQuery {
	from?: any[];
	orderBy?: IFieldInOrderBy<any, any>[]
	select: any;
	where?: JSONBaseOperation;
}

export interface PHJsonCommonSQLQuery {
	from?: JSONRelation[];
	orderBy?: JSONFieldInOrderBy[];
	select: any;
	where?: JSONBaseOperation;
}

export interface PHJsonLimitedSQLQuery {
	limit?:number;
	offset?:number;
}

export interface PHSQLQuery extends PHQuery {
	toJSON(): PHJsonCommonSQLQuery;
}