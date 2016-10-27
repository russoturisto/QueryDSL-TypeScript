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

export interface IFieldInOrderBy<IQ extends IQEntity, IQF extends IQField<IQ, IQF>> {
}

export class FieldInOrderBy<IQ extends IQEntity, IQF extends IQField<IQ, IQF>>
implements IFieldInOrderBy<IQ, IQF> {

	constructor(
		public field: Orderable<IQ, IQF>,
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