/**
 * Created by Papa on 10/16/2016.
 */

import {IQEntity} from "../entity/Entity";
import {IQField, Orderable} from "./Field";
import {QRelation} from "../entity/Relation";

export interface JSONFieldInOrderBy {
	alias: string;
	isManyToOneReference?:boolean;
	propertyName: string;
	sortOrder: SortOrder;
}

export enum SortOrder {
	ASCENDING,
	DESCENDING
}

export interface IFieldInOrderBy<IQ extends IQEntity> {
	field: Orderable<IQ>;
	sortOrder: SortOrder;
}

export class FieldInOrderBy<IQ extends IQEntity> implements IFieldInOrderBy<IQ> {

	constructor(
		public field: Orderable<IQ>,
		public sortOrder: SortOrder
	) {
	}

	toJSON(): JSONFieldInOrderBy {
		return {
			alias: QRelation.getPositionAlias(this.field.q.fromClausePosition),
			propertyName: this.field.fieldName,
			sortOrder: this.sortOrder
		};

	}

}