/**
 * Created by Papa on 10/16/2016.
 */

import {IQEntity} from "../entity/Entity";
import {Orderable, JSONClauseField} from "./Field";

export interface JSONFieldInOrderBy {
	field: JSONClauseField;
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
			field: this.field.toJSON(),
			sortOrder: this.sortOrder
		};
	}

}