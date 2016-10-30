/**
 * Created by Papa on 10/16/2016.
 */

import {IQEntity} from "../entity/Entity";
import {Orderable, IQField, QField} from "./Field";
import {JSONClauseField} from "./Appliable";

export interface JSONFieldInOrderBy {
	field: JSONClauseField;
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
			field: (<QField<any,any>>this.field).toJSON(),
			sortOrder: this.sortOrder
		};
	}

}