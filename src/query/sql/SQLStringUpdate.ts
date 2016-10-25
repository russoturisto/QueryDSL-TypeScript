import {IEntity, IQEntity} from "../../core/entity/Entity";
import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {PHJsonSQLUpdate} from "./PHSQLUpdate";
import {SQLDialect} from "./SQLStringQuery";
import {EntityRelationRecord, QRelation} from "../../core/entity/Relation";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {SQLStringNoJoinQuery} from "./SQLStringNoJoinQuery";
import {QBooleanField} from "../../core/field/BooleanField";
import {QDateField} from "../../core/field/DateField";
import {QNumberField} from "../../core/field/NumberField";
import {QStringField} from "../../core/field/StringField";
import {MetadataUtils} from "../../core/entity/metadata/MetadataUtils";
/**
 * Created by Papa on 10/2/2016.
 */

export class SQLStringUpdate<IE extends IEntity> extends SQLStringNoJoinQuery<IE> {

	constructor(
		public phJsonUpdate: PHJsonSQLUpdate<IE>,
		qEntity: IQEntity,
		qEntityMap: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
	}

	toSQL(
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		if (!this.phJsonUpdate.update) {
			throw `Expecting exactly one table in FROM clause`;
		}
		let entityName = this.rootQEntity.__entityName__;
		let joinNodeMap = this.getJoinNodeMap();
		let updateAlias = QRelation.getAlias(this.phJsonUpdate.update);
		let updateFragment = this.getTableFragment(this.phJsonUpdate.update);
		let setFragment = this.getSetFragment(updateAlias, entityName, this.phJsonUpdate.set, embedParameters, parameters);
		let whereFragment = this.getWHEREFragment(this.phJsonUpdate.where, 0, joinNodeMap, embedParameters, parameters);

		return `update
${updateFragment}
SET
${setFragment}
WHERE
${whereFragment}`;
	}

	protected getSetFragment(
		updateAlias: string,
		entityName: string,
		setClauseFragment: IE,
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {

		let qEntity = this.qEntityMapByAlias[updateAlias];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

		let setFragments = [];
		for (let propertyName in setClauseFragment) {

			let value = setClauseFragment[propertyName];
			// Skip undefined values
			if (value === undefined) {
				continue;
			}
			let columnName;
			if (entityPropertyTypeMap[propertyName]) {
				columnName = this.getEntityPropertyColumnName(qEntity, propertyName, null);

				if (!embedParameters) {
					parameters.push(value);
					value = '?';
				}
				let field = qEntity.__entityFieldMap__[propertyName];
				if (!field) {
					throw `Did not find field '${entityName}.${propertyName}' used in the WHERE clause.`;
				}
				if (field instanceof QBooleanField) {
					value = this.getSetValueFragment(value, entityName, propertyName, this.booleanTypeCheck, embedParameters, parameters);
				} else if (field instanceof QDateField) {
					value = this.getSetValueFragment(value, entityName, propertyName, this.dateTypeCheck, embedParameters, parameters, this.sqlAdaptor.dateToDbQuery);
				} else if (field instanceof QNumberField) {
					value = this.getSetValueFragment(value, entityName, propertyName, this.numberTypeCheck, embedParameters, parameters);
				} else if (field instanceof QStringField) {
					value = this.getSetValueFragment(value, entityName, propertyName, this.stringTypeCheck, embedParameters, parameters, this.sanitizeStringValue);
				} else {
					throw `Unexpected type '${(<any>field.constructor).name}' of field '${entityName}.${propertyName}' for assignment in the SET clause.`;
				}
			} else if (entityRelationMap[propertyName]) {
				if (entityMetadata.manyToOneMap[propertyName]) {
					columnName = MetadataUtils.getJoinColumnName(propertyName, entityMetadata);

					let relation = qEntity.__entityRelationMap__[propertyName];
					if (!relation) {
						throw `Did not find field '${entityName}.${propertyName}' used in the WHERE clause.`;
					}
					let relationGenericQEntity = this.qEntityMapByName[relation.entityName];
					let relationEntityMetadata: EntityMetadata = <EntityMetadata><any>relationGenericQEntity.__entityConstructor__;
					// get the parent object's id
					value = MetadataUtils.getIdValue(value, relationEntityMetadata);
					if (!value) {
						throw `@ManyToOne relation's (${entityName}) object @Id value is missing `;
					}
					let relationField = relationGenericQEntity.__entityFieldMap__[relationEntityMetadata.idProperty];
					if (relationField instanceof QBooleanField) {
						value = this.getSetValueFragment(value, entityName, propertyName, this.booleanTypeCheck, embedParameters, parameters);
					} else if (relationField instanceof QDateField) {
						value = this.getSetValueFragment(value, entityName, propertyName, this.dateTypeCheck, embedParameters, parameters, this.sqlAdaptor.dateToDbQuery);
					} else if (relationField instanceof QNumberField) {
						value = this.getSetValueFragment(value, entityName, propertyName, this.numberTypeCheck, embedParameters, parameters);
					} else if (relationField instanceof QStringField) {
						value = this.getSetValueFragment(value, entityName, propertyName, this.stringTypeCheck, embedParameters, parameters, this.sanitizeStringValue);
					} else {
						throw `Unexpected type '${(<any>relation.constructor).name}' of field '${entityName}.${propertyName}' for assignment in the SET clause.`;
					}
				} else {
					throw `Cannot use @OneToMany property '${entityName}.${propertyName}' for assignment in the SET clause.`;
				}
			} else {
				throw `Unexpected property '${propertyName}' on entity '${entityName}' in SET clause.`;
			}
			setFragments.push(`\t${columnName} = ${value}`);
		}

		return setFragments.join(', \n');
	}

	protected getSetPropertyColumnName(
		qEntity: IQEntity,
		propertyName: string
	): string {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		return MetadataUtils.getPropertyColumnName(propertyName, entityMetadata);
	}

	private getSetValueFragment<T>(
		value: any,
		entityName: string,
		propertyName: string,
		typeCheckFunction: ( value: any )=>boolean,
		embedParameters: boolean = true,
		parameters: any[] = null,
		conversionFunction?: (
			value: any,
			embedParameters: boolean
		)=>any
	): string {
		if (!typeCheckFunction(value)) {
			throw `Unexpected value (${value}) for $eq (=) operation on '${entityName}.${propertyName}' used in the SET clause.`;
		}
		if (conversionFunction) {
			value = conversionFunction(value, embedParameters);
		}
		if (embedParameters) {
			parameters.push(value);
			value = '?';
		}

		return value;
	}

}
