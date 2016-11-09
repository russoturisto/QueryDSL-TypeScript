/**
 * Created by Papa on 10/16/2016.
 */

import {Orderable, IQField, QField} from "./Field";
import {FieldColumnAliases} from "../entity/Aliases";

export interface JSONFieldInGroupBy {
	fieldAlias: string;
}

export interface JSONFieldInOrderBy extends JSONFieldInGroupBy {
	sortOrder: SortOrder;
}

export interface JSONEntityFieldInOrderBy extends JSONFieldInOrderBy {
	entityName: string,
	propertyName: string
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

	toJSON( columnAliases: FieldColumnAliases ): JSONFieldInOrderBy {
		if (!columnAliases.hasAliasFor(this.field)) {
			throw `Field used in order by clause is not present in select clause`;
		}
		return {
			fieldAlias: columnAliases.getExistingAlias(this.field),
			sortOrder: this.sortOrder
		};
	}

	toEntityJSON(): JSONEntityFieldInOrderBy {
		let qField = <QField<IQF>>this.field;
		return {
			fieldAlias: undefined,
			propertyName: qField.fieldName,
			entityName: qField.entityName,
			sortOrder: this.sortOrder
		};
	}

}