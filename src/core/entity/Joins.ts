import {PHRawMappedSQLQuery, IMappedEntity} from "../../query/sql/query/ph/PHMappedSQLQuery";
import {JSONRelation} from "./Relation";
import {getNextRootEntityName} from "./Aliases";
import {IFrom, QEntity, QView, IQEntity} from "./Entity";
import {JSONBaseOperation} from "../operation/Operation";
import {IQField, QField} from "../field/Field";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/25/2016.
 */

export function view<IME extends IMappedEntity>(
	query: (( ...args: any[] )=> PHRawMappedSQLQuery<IME>) | PHRawMappedSQLQuery<IME>
): IME & IFrom {
	let queryDefinition: PHRawMappedSQLQuery<IME>;
	if (query instanceof Function) {
		queryDefinition = query();
	} else {
		queryDefinition = query;
	}

	// When retrieved via the view() function the query is the first one in the list
	let rootQuery = <JSONRelation><any>queryDefinition;
	rootQuery.currentChildIndex = 0;
	rootQuery.fromClausePosition = [];
	rootQuery.rootEntityPrefix = getNextRootEntityName();
	let view = new QView(rootQuery.rootEntityPrefix, rootQuery.fromClausePosition, queryDefinition);

	let customEntity: IME = <IME>queryDefinition.select;
	view = convertMappedEntitySelect(customEntity, queryDefinition, view);

	return <IME & IFrom><any>view;
}


function convertMappedEntitySelect<IME extends IMappedEntity>(
	customEntity: IME,
	queryDefinition: PHRawMappedSQLQuery<IME>,
	view: QView
): QView {
	for (let property in customEntity) {
		let value = customEntity[property];
		if (value instanceof QField) {
			view[property] = value.getInstance();
			view[property].q = view;
		} else {
			if (value instanceof Object && !(value instanceof Date)) {
				view[value] = convertMappedEntitySelect(value, queryDefinition, view);
			} else {
				throw `All SELECT clause entries of a Mapped query must be Fields or Functions`;
			}
		}
	}

	return view;
}

/**
 * Sub-queries in select clause
 * @param query
 * @returns {IQF}
 */
export function field<IQF extends IQField<any>>(
	query: ( ...args: any[] ) => PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>
): IQField<IQF> {
	let queryDefinition: PHRawFieldSQLQuery<IQF>;
	if (query instanceof Function) {
		queryDefinition = query();
	} else {
		queryDefinition = query;
	}
	let customField: IQF = <IQF>queryDefinition.select;
	customField = (<QField<IQF>><any>customField).addSubQuery(queryDefinition);
	// Field query cannot be joined to any other query so don't have set the positional fields
	return customField;

}

export enum JoinType {
	FULL_JOIN,
	INNER_JOIN,
	LEFT_JOIN,
	RIGHT_JOIN
}

export interface JoinOperation<IF extends IFrom> {
	( entity: IF ): JSONBaseOperation;
}

export class JoinFields<IF extends IFrom> {

	constructor(
		private joinTo: IF
	) {
		if (!(this.joinTo instanceof QEntity)) {
			throw `Right value in join must be a View or an Entity`;
		}
	}

	on( joinOperation: JoinOperation<IF> ): IF {
		let joinChild: IQEntity = <IQEntity><any>this.joinTo;
		joinChild.joinWhereClause = joinOperation(this.joinTo);

		return this.joinTo;
	}
}