import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {ISQLAdaptor, getSQLAdaptor} from "./adaptor/SQLAdaptor";
import {PHJsonSQLQuery} from "./PHSQLQuery";
import {SQLDialect} from "./SQLStringQuery";
import {RelationRecord} from "../../core/entity/Relation";
import {QBooleanField} from "../../core/field/BooleanField";
import {QDateField} from "../../core/field/DateField";
import {QNumberField} from "../../core/field/NumberField";
import {QStringField} from "../../core/field/StringField";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {ColumnConfiguration} from "../../core/entity/metadata/ColumnDecorators";
import {FieldMap} from "./FieldMap";
/**
 * Created by Papa on 10/2/2016.
 */

export abstract class SQLStringWhereBase<IE extends IEntity> {

    fieldMap: FieldMap = new FieldMap();
    joinAliasMap: {[entityName: string]: string} = {};
    sqlAdaptor: ISQLAdaptor;

    constructor(
        public phJsonQuery: PHJsonSQLQuery<IE>,
        public qEntity: QEntity<any>,
        public qEntityMap: {[entityName: string]: QEntity<any>},
        public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
        public entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
        protected dialect: SQLDialect
    ) {
        this.sqlAdaptor = getSQLAdaptor(dialect);
    }

    protected getWHEREFragment(
        operation: JSONBaseOperation,
        nestingIndex: number,
        joinQEntityMap: {[alias: string]: IQEntity},
        embedParameters: boolean = true,
        parameters: any[] = null
    ): string {
        let whereFragment = '';

        let nestingPrefix = '';
        for (let i = 0; i < nestingIndex; i++) {
            nestingPrefix += '\t';
        }

        let foundProperty;
        for (let property in operation) {
            if (foundProperty) {
                throw `More than one property found in a WHERE Clause operation ${foundProperty}, ${property}, ...`;
            }
            foundProperty = property;

            let operator;
            switch (property) {
                case '$and':
                    operator = 'AND';
                case '$or':
                    operator = 'OR';
                    let childOperations = operation[property];
                    if (!(childOperations instanceof Array)) {
                        throw `Expecting an array of child operations as a value for operator ${operator}, in the WHERE Clause.`;
                    }
                    whereFragment = childOperations.map(( childOperation ) => {
                        this.getWHEREFragment(childOperation, nestingIndex + 1, joinQEntityMap);
                    }).join(`\n${nestingPrefix}${operator} `);
                    whereFragment = `( ${whereFragment} )`;
                    break;
                case '$not':
                    operator = 'NOT';
                    whereFragment = `${operator} ${this.getWHEREFragment(operation[property], nestingIndex + 1, joinQEntityMap)}`;
                    break;
                default:
                    let aliasColumnPair = property.split('.');
                    if (aliasColumnPair.length != 2) {
                        throw `Expecting 'alias.column' instead of ${property}`;
                    }
                    let alias = aliasColumnPair[0];
                    let qEntity = joinQEntityMap[alias];
                    if (!qEntity) {
                        throw `Unknown alias '${alias}' in WHERE clause`;
                    }
                    let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
                    let propertyName = aliasColumnPair[1];
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        throw `Found @ManyToOne property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
                    } else if (entityMetadata.oneToManyMap[propertyName]) {
                        throw `Found @ManyToOne property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
                    } else if (entityMetadata.transient[propertyName]) {
                        throw `Found @Transient property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
                    }

                    let field = qEntity.__entityFieldMap__[propertyName];
                    if (!field) {
                        throw `Did not find field '${alias}.${propertyName}' used in the WHERE clause.`;
                    }

                    let columnName = this.getEntityPropertyColumnName(qEntity, propertyName, alias);
                    whereFragment = `${alias}.${columnName} `;

                    let valueOperation = operation[property];
                    let fieldOperation;
                    for (let operationProperty in valueOperation) {
                        if (fieldOperation) {
                            throw `More than one operation (${fieldOperation}, ${operationProperty}, ...) is defined on field '${alias}.${propertyName}' used in the WHERE clause.`;
                        }
                        fieldOperation = operationProperty;
                    }

                    let operatorAndValueFragment;
                    let value = valueOperation[fieldOperation];
                    if (field instanceof QBooleanField) {
                        operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'boolean', embedParameters, parameters);
                        if (!operatorAndValueFragment) {
                            throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`
                        }
                    } else if (field instanceof QDateField) {
                        operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'Date', embedParameters, parameters, this.sqlAdaptor.dateToDbQuery);
                    } else if (field instanceof QNumberField) {
                        operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'number', embedParameters, parameters);

                    } else if (field instanceof QStringField) {
                        operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'string', embedParameters, parameters, this.sanitizeStringValue);
                        if (!operatorAndValueFragment) {
                            switch (fieldOperation) {
                                case '$like':
                                    if (typeof value != 'string') {
                                        this.throwValueOnOperationError('string', '$like (LIKE)', alias, propertyName);
                                    }
                                    value = this.sanitizeStringValue(value, embedParameters);
                                    if (!embedParameters) {
                                        parameters.push(value);
                                        value = '?';
                                    }
                                    operatorAndValueFragment = `LIKE ${value}`;
                                    break;
                                default:
                                    throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`;
                            }
                        }
                    } else {
                        throw `Unexpected type '${(<any>field.constructor).name}' of field '${alias}.${propertyName}' for operation '${fieldOperation}' in the WHERE clause.`;
                    }

                    whereFragment += operatorAndValueFragment;
                    break;
            }
        }

        return whereFragment;
    }

    private getComparibleOperatorAndValueFragment<T>(
        fieldOperation: string,
        value: any,
        alias: string,
        propertyName: string,
        typeCheckFunction: ( value: any )=>boolean,
        typeName: string,
        embedParameters: boolean = true,
        parameters: any[] = null,
        conversionFunction?: (
            value: any,
            embedParameters: boolean
        )=>any
    ): string {
        let operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction);
        if (operatorAndValueFragment) {
            return operatorAndValueFragment;
        }
        let opString;
        switch (fieldOperation) {
            case '$gt':
                opString = '$gt (>)';
                break;
            case '$gte':
                opString = '$gte (>=)';
                break;
            case '$lt':
                opString = '$lt (<)';
                break;
            case '$lte':
                opString = '$gt (<=)';
                break;
            default:
                throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`
        }
        if (!typeCheckFunction(value)) {
            this.throwValueOnOperationError(typeName, opString, alias, propertyName);
        }
        if (conversionFunction) {
            value = conversionFunction(value, embedParameters);
        }
        if (!embedParameters) {
            parameters.push(value);
            value = '?';
        }
        switch (fieldOperation) {
            case '$gt':
                return `> ${value}`;
            case '$gte':
                return `>= ${value}`;
            case '$lt':
                return `< ${value}`;
            case '$lte':
                return `<= ${value}`;
            default:
                throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`
        }
    }

    private getCommonOperatorAndValueFragment<T>(
        fieldOperation: string,
        value: any,
        alias: string,
        propertyName: string,
        typeCheckFunction: ( value: any )=>boolean,
        typeName: string,
        embedParameters: boolean = true,
        parameters: any[] = null,
        conversionFunction?: (
            value: any,
            embedParameters: boolean
        )=>any
    ): string {
        let sqlOperator;

        switch (fieldOperation) {
            case '$eq':
                sqlOperator = '=';
                if (!typeCheckFunction(value)) {
                    this.throwValueOnOperationError(typeName, '$eq (=)', alias, propertyName);
                }
                if (conversionFunction) {
                    value = conversionFunction(value, embedParameters);
                }
                break;
            case '$exists':
                if (value === true) {
                    sqlOperator = 'IS NOT NULL';
                } else if (value === false) {
                    sqlOperator = 'IS NULL';
                } else {
                    throw `Invalid $exists value, expecting 'true' (IS NOT NULL), or 'false' (IS NULL)`;
                }
                break;
            case '$in':
                sqlOperator = 'IN';
                if (!(value instanceof Array)) {
                    this.throwValueOnOperationError(`${typeName}[]`, '$in (IN)', alias, propertyName);
                }
                value = value.map(( aValue: string )=> {
                    if (!typeCheckFunction(aValue)) {
                        this.throwValueOnOperationError(`${typeName}[]`, '$eq (=)', alias, propertyName);
                        if (conversionFunction) {
                            return conversionFunction(aValue, embedParameters);
                        } else {
                            return aValue;
                        }
                    }
                }).join(', ');
                break;
            case '$ne':
                sqlOperator = '!=';
                if (!typeCheckFunction(value)) {
                    this.throwValueOnOperationError(typeName, '$ne (!=)', alias, propertyName);
                }
                if (conversionFunction) {
                    value = conversionFunction(value, embedParameters);
                }
                break;
            case '$nin':
                sqlOperator = 'NOT IN';
                if (!(value instanceof Array)) {
                    this.throwValueOnOperationError(`${typeName}[]`, '$in (IN)', alias, propertyName);
                }
                value = value.map(( aValue: string )=> {
                    if (!typeCheckFunction(aValue)) {
                        this.throwValueOnOperationError(`${typeName}[]`, '$eq (=)', alias, propertyName);
                        if (conversionFunction) {
                            return conversionFunction(aValue, embedParameters);
                        } else {
                            return aValue;
                        }
                    }
                }).join(', ');
                break;
            default:
                return undefined;
        }

        if (!embedParameters) {
            parameters.push(value);
            value = '?';
        }

        return `${sqlOperator} ${value}`;
    }

    protected getEntityPropertyColumnName(
        qEntity: IQEntity,
        propertyName: string,
        tableAlias: string
    ): string {
        let entityName = qEntity.__entityName__;
        let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
        let columnMap = entityMetadata.columnMap;

        let columnName = this.getPropertyColumnName(entityName, propertyName, tableAlias, columnMap);
        this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);

        return columnName;
    }

    protected getTableName( qEntity: IQEntity ): string {
        let tableName = qEntity.__entityName__;
        let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
        if (entityMetadata.table) {
            if (!entityMetadata.table.name) {
                throw `Found @Table but not @Table.name for entity: ${tableName}`;
            } else {
                tableName = entityMetadata.table.name;
            }
        } else {
            this.warn(`Did not find @Table.name for first table in FROM clause. Using entity class name.`);
        }

        return tableName;
    }

    private getPropertyColumnName(
        entityName: string,
        propertyName: string,
        tableAlias: string,
        columnMap: {[propertyName: string]: ColumnConfiguration}
    ): string {
        let columnName;
        if (columnMap && columnMap[propertyName]) {
            columnName = columnMap[propertyName].name;
            if (!columnName) {
                throw `Found @Column but not @Column.name for '${entityName}.${propertyName}' (alias '${tableAlias}') in the SELECT clause.`;
            }
        } else {
            this.warn(`Did not find @Column for '${entityName}.${propertyName}' (alias '${tableAlias}') in the SELECT clause. Using property name`);
            columnName = propertyName;
        }

        return columnName;
    }

    private throwValueOnOperationError(
        valueType: string,
        operation: string,
        alias: string,
        propertyName: string
    ) {
        throw `Expecting a string value for $eq (=) operation on '${alias}.${propertyName}' used in the WHERE clause.`;
    }

    private sanitizeStringValue(
        value: string,
        embedParameters: boolean
    ): string {
        // FIXME: sanitize the string to prevent SQL Injection attacks.

        if (embedParameters) {
            value = `'${value}'`;
        }
        return value;
    }

    private booleanTypeCheck(
        valueToCheck: any
    ): boolean {
        return typeof valueToCheck === 'boolean';
    }

    private dateTypeCheck(
        valueToCheck: any
    ): boolean {
        // TODO: see if there is a more appropriate way to check serialized Dates
        if (typeof valueToCheck === 'number') {
            valueToCheck = new Date(valueToCheck);
        }
        return valueToCheck instanceof Date;
    }

    private numberTypeCheck(
        valueToCheck: any
    ): boolean {
        return typeof valueToCheck === 'number';
    }

    private stringTypeCheck(
        valueToCheck: any
    ): boolean {
        return typeof valueToCheck === 'string';
    }

    protected addField(
        entityName: string,
        tableName: string,
        propertyName: string,
        columnName: string
    ): void {
        this.fieldMap.ensure(entityName, tableName).ensure(propertyName, columnName);
    }


    protected warn(
        warning: string
    ): void {
        console.log(warning);
    }

}