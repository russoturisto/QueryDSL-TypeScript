/**
 * Created by Papa on 9/10/2016.
 */

export class FieldMap {
	entityMap: {[entityName: string]: EntityFieldMap} = {};
	tableMap: {[tableName: string]: EntityFieldMap} = {};

	ensure(
		entityName: string,
		tableName: string
	): EntityFieldMap {
		let entityFieldMap = this.entityMap[entityName];
		if (!entityFieldMap) {
			entityFieldMap = new EntityFieldMap(entityName, tableName);
			this.entityMap[entityName] = entityFieldMap;
			this.tableMap[tableName] = entityFieldMap;
		}

		return entityFieldMap;
	}

	existsByStructure(
		tableName: string,
		columnName: string
	): boolean {
		let entityFieldMap = this.tableMap[tableName];
		if (!entityFieldMap) {
			return false;
		}
		return !!entityFieldMap.columnMap[columnName];
	}

	existsByModel(
		entityName: string,
		propertyName: string
	): boolean {
		let entityFieldMap = this.entityMap[entityName];
		if (!entityFieldMap) {
			return false;
		}
		return !!entityFieldMap.propertyMap[propertyName];
	}

}

export class EntityFieldMap {
	columnMap: {[columnName: string]: PropertyFieldEntry} = {};
	propertyMap: {[propertyName: string]: PropertyFieldEntry} = {};

	constructor(
		public entityName: string,
		public tableName: string
	) {
	}

	ensure(
		propertyName: string,
		columnName: string
	): PropertyFieldEntry {
		let propertyFieldEntry = this.propertyMap[propertyName];
		if (!propertyFieldEntry) {
			propertyFieldEntry = new PropertyFieldEntry(propertyName, columnName);
			this.propertyMap[propertyName] = propertyFieldEntry;
			this.columnMap[columnName] = propertyFieldEntry;
		}

		return propertyFieldEntry;
	}

}

export class PropertyFieldEntry {
	constructor(
		public propertyName: string,
		public columnName: string
	) {
	}
}