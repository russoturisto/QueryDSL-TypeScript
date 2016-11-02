/**
 * Created by Papa on 10/16/2016.
 */

import {Orderable, IQField, QField} from "./Field";
import {ColumnAliases} from "../entity/Aliases";

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

	toJSON( columnAliases: ColumnAliases ): JSONFieldInOrderBy {
		if(!columnAliases.hasField(this.field)) {
			throw `Field used in order by clause is not present in select clause`;
		}
		return {
			fieldAlias: (<QField<IQF>>this.field).alias,
			sortOrder: this.sortOrder
		};
	}

	toEntityJSON(): JSONFieldInOrderBy {
		let qField = <QField<IQF>>this.field;
		return {
			fieldAlias: `${qField.entityName}.${qField.fieldName}`,
			sortOrder: this.sortOrder
		};
	}

}