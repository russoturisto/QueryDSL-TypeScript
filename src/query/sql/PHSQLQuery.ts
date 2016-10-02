import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {RelationRecord, JSONRelation} from "../../core/entity/Relation";
import {JSONLogicalOperation} from "../../core/operation/LogicalOperation";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {PHQuery, PHRawQuery} from "../PHQuery";
/**
 * Created by Papa on 8/12/2016.
 */

export interface PHRawSQLQuery<IE extends IEntity> extends PHRawQuery<IE> {
	select: IE;
	from?: IQEntity[];
	where?: JSONBaseOperation;
}

export interface PHJsonSQLQuery<IE extends IEntity> {
	select: IE;
	from: JSONRelation[];
	where?: JSONBaseOperation;
}


export enum JoinType {
	INNER_JOIN,
	LEFT_JOIN
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

	toSQL(): PHJsonSQLQuery<IE> {
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

	toWhereFragment(
		operation: JSONBaseOperation
	): string {
		let sqlLogicalOperator = this.getLogicalOperator(operation);
		if (sqlLogicalOperator) {
			this.toLogicalWhereFragment(operation);
		}

		return null;
	}

	toLogicalWhereFragment(
		logicalOperation: JSONLogicalOperation
	): string {
		let sqlLogicalOperator;
		for (let operator in logicalOperation) {
			if (sqlLogicalOperator) {
				throw 'Logical operator is already defined';
			}
			switch (operator) {
				case '$and':
					sqlLogicalOperator = 'AND';
					break;
				case '$not':
					sqlLogicalOperator = 'NOT';
					break;
				case '$or':
					sqlLogicalOperator = 'OR';
					break;
			}
		}
		return null;
	}

	toAndOrWhereFragment(
		operations: JSONBaseOperation[],
		sqlLogicalOperator
	): string {
		return null;
	}

	getLogicalOperator(
		logicalOperation: JSONLogicalOperation
	): string {
		let sqlLogicalOperator;
		for (let operator in logicalOperation) {
			if (sqlLogicalOperator) {
				throw 'Logical operator is already defined';
			}
			switch (operator) {
				case '$and':
					sqlLogicalOperator = 'AND';
					break;
				case '$not':
					sqlLogicalOperator = 'NOT';
					break;
				case '$or':
					sqlLogicalOperator = 'OR';
					break;
			}
		}
		return sqlLogicalOperator;
	}
}