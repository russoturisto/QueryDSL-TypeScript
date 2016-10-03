import {EntityMetadata} from "../EntityMetadata";
import {OneToManyElements} from "./ColumnDecorators";
/**
 * Created by Papa on 9/2/2016.
 */

export interface OneToManyConfigAndProperty {
	propertyName:string;
	config:OneToManyElements;
}

export class MetadataUtils {

	static getRelatedOneToManyConfig(
		manyToOnePropertyName,
		entityMetadata: EntityMetadata
	): OneToManyConfigAndProperty {
		for (let oneToManyProperty in entityMetadata.oneToManyMap) {
			let oneToManyConfig = entityMetadata.oneToManyMap[oneToManyProperty];
			if (oneToManyConfig.mappedBy === manyToOnePropertyName) {
				return {
					propertyName: oneToManyProperty,
					config: oneToManyConfig
				};
			}
		}
		return null;
	}

	static getPropertyColumnName(
		propertyName: string,
		entityMetadata: EntityMetadata
	): string {
		let entityName = entityMetadata.name;
		let columnMap = entityMetadata.columnMap;
		let columnName: string;
		if (columnMap[propertyName]) {
			columnName = columnMap[propertyName].name;
			if (!columnName) {
				throw `Found @Column but not @Column.name for '${entityName}.${propertyName}'.`;
			}
		} else {
			this.warn(`Did not find @Column for '${entityName}.${propertyName}'. Using property name.`);
			columnName = propertyName;
		}

		return columnName;
	}

	static getJoinColumnName(
		propertyName: string,
		entityMetadata: EntityMetadata
	): string {
		let entityName = entityMetadata.name;
		let joinColumnMap = entityMetadata.joinColumnMap;
		let joinColumnName: string;
		if (joinColumnMap[propertyName]) {
			joinColumnName = joinColumnMap[propertyName].name;
			if (!joinColumnName) {
				throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}'.`;
			}
		} else {
			this.warn(`Did not find @JoinColumn for '${entityName}.${propertyName}'. Using property name.`);
			joinColumnName = propertyName;
		}

		return joinColumnName;
	}

	// static getManyToOneColumnName(
	// 	propertyName:string,
	// 	entityMetadata:EntityMetadata
	// ):string {
	//
	// }

	static getIdValue(
		entityObject: any,
		entityMetadata: EntityMetadata
	): string {
		let idProperty = entityMetadata.idProperty;
		if (!idProperty) {
			throw `@Id is not defined on entity ${entityMetadata.name}`;
		}
		return entityObject[idProperty];
	}

	static getTableName(
		entityMetadata: EntityMetadata
	): string {
		let tableConfig = entityMetadata.table;
		if (!tableConfig) {
			return null;
		}
		if (tableConfig && !tableConfig.name) {
			throw `@Table is defined on ${entityMetadata.name}, but @Table.name is not`;
		}
		return tableConfig.name;
	}

	static getOneToManyConfig(
		propertyName: string,
		entityMetadata: EntityMetadata
	): OneToManyElements {
		let oneToManyConfig = entityMetadata.oneToManyMap[propertyName];
		if (!oneToManyConfig) {
			throw `@OneToMany is not defined on ${entityMetadata.name}.${propertyName}`;
		}
		return oneToManyConfig;
	}

	static warn(message: string) {
		console.log(message);
	}

}