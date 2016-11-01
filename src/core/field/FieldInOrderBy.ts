/**
 * Created by Papa on 10/16/2016.
 */

import {Orderable, IQField, QField} from "./Field";

export interface JSONFieldInGroupBy {
	fieldAlias: string;
}

export interface JSONFieldInOrderBy extends JSONFieldInGroupBy {
	fieldAlias: string;
	sortOrder: SortOrder;
}

export enum SortOrder {
	ASCENDING,
	DESCENDING
}

export interface IFieldInOrderBy<IQF extends IQField<IQF>> {
}

export class FieldInOrderBy<IQF extends IQField<IQF>>
implements IFieldInOrderBy<IQF> {

	constructor(
		public field: Orderable<IQF>,
		public sortOrder: SortOrder
	) {
	}

	toJSON(): JSONFieldInOrderBy {
		return {
			fieldAlias: (<QField<IQF>>this.field).alias,
			sortOrder: this.sortOrder
		};
	}

}