import {PHRawMappedSQLQuery} from "../../query/sql/query/ph/PHMappedSQLQuery";
import {JSONRelation, JSONJoinRelation, QRelation} from "./Relation";
import {getNextRootEntityName} from "./Aliases";
import {IFrom, QEntity} from "./Entity";
import {JSONBaseOperation} from "../operation/Operation";
import {IQField, QField} from "../field/Field";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField} from "../field/OperableField";
/**
 * Created by Papa on 10/25/2016.
 */

export const SUB_SELECT_QUERY = '.subSelect';

export function view<EMap>(
	query: ( ...args: any[] )=> PHRawMappedSQLQuery<EMap>| PHRawMappedSQLQuery<EMap>
): EMap {
	let queryDefinition: PHRawMappedSQLQuery<EMap>;
	if (query instanceof Function) {
		queryDefinition = query();
	} else {
		queryDefinition = query;
	}
	let customEntity: EMap = <EMap>queryDefinition.select;
	// When retrieved via the view() function the query is the first one in the list
	let rootQuery = <JSONRelation><any>queryDefinition;
	rootQuery.currentChildIndex = 0;
	rootQuery.fromClausePosition = [];
	rootQuery.rootEntityPrefix = getNextRootEntityName();
	customEntity[SUB_SELECT_QUERY] = queryDefinition;

	return customEntity;
}

/**
 * Sub-queries in select clause
 * @param query
 * @returns {IQF}
 */
export function field<IQF extends IQField<any, any>>(
	query: ( ...args: any[] ) => PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>
): IQField<any, IQF> {
	let queryDefinition: PHRawFieldSQLQuery<IQF>;
	if (query instanceof Function) {
		queryDefinition = query();
	} else {
		queryDefinition = query;
	}
	let customField: IQF = <IQF>queryDefinition.select;
	customField = (<QField<any, IQF>><any>customField).addSubQuery(queryDefinition);
	// Field query cannot be joined to any other query so don't have set the positional fields
	return customField;

}

export enum JoinType {
	FULL_JOIN,
	INNER_JOIN,
	LEFT_JOIN,
	RIGHT_JOIN
}

export interface JoinOperation<IF extends IFrom, EMap> {
	( entity: IF | EMap ): JSONBaseOperation;
}

export class JoinFields<IF extends IFrom, EMap> {

	constructor(
		private joinTo: IF | PHRawMappedSQLQuery<EMap>
	) {
	}

	on( joinOperation: JoinOperation<IF, EMap> ): IF | EMap {
		let entity;
		let joinChild: JSONJoinRelation = <JSONJoinRelation><any>this.joinTo;
		if (this.joinTo instanceof QEntity) {
			entity = this.joinTo;
		} else {
			entity = (<PHRawMappedSQLQuery<EMap>>this.joinTo).select;
			entity[SUB_SELECT_QUERY] = joinChild;
		}
		joinChild.joinWhereClause = joinOperation(entity);

		return entity;
	}
}

function join<IF extends IFrom, EMap>(
	left: IF | EMap,
	right: IF | PHRawMappedSQLQuery<EMap>,
	joinType: JoinType
): JoinFields<IF, EMap> {
	let nextChildPosition;
	let joinParent: JSONJoinRelation;
	// If left is a Raw Mapped Query
	if (!(left instanceof QEntity)) {
		joinParent = <JSONJoinRelation><any>left[SUB_SELECT_QUERY];
	} else {
		joinParent = <JSONJoinRelation><any>left;
	}

	let joinChild: JSONJoinRelation = <JSONJoinRelation><any>right;
	joinChild.currentChildIndex = 0;
	nextChildPosition = QRelation.getNextChildJoinPosition(joinParent);
	joinChild.fromClausePosition = nextChildPosition;
	joinChild.joinType = joinType;
	joinChild.rootEntityPrefix = joinParent.rootEntityPrefix;

	return new JoinFields<IF, EMap>(right);
}

export function fullJoin<IF extends IFrom, EMap>(
	left: IF | EMap,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.FULL_JOIN);
}

export function innerJoin<IF extends IFrom, EMap>(
	left: IF | EMap,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.INNER_JOIN);
}

export function leftJoin<IF extends IFrom, EMap>(
	left: IF | EMap,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.LEFT_JOIN);
}

export function rightJoin<IF extends IFrom, EMap>(
	left: IF | EMap,
	right: IF | PHRawMappedSQLQuery<EMap>
): JoinFields<IF, EMap> {
	return join<IF, EMap>(left, right, JoinType.RIGHT_JOIN);
}