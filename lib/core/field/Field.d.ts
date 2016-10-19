/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { JSONBaseOperation, IOperation } from "../operation/Operation";
import { JSONFieldInOrderBy } from "./FieldInOrderBy";
import { JSONSqlFunctionCall } from "./Functions";
import { Appliable, JSONClauseField } from "./Applicable";
export declare enum FieldType {
    BOOLEAN = 0,
    BOOLEAN_ARRAY = 1,
    DATE = 2,
    DATE_ARRAY = 3,
    NUMBER = 4,
    NUMBER_ARRAY = 5,
    STRING = 6,
    STRING_ARRAY = 7,
}
export interface Orderable<IQ extends IQEntity> extends Appliable<JSONClauseField, IQ> {
    asc(): JSONFieldInOrderBy;
    desc(): JSONFieldInOrderBy;
}
export interface IQField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>> extends Orderable<IQ> {
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    operation: IO;
    q: IQ;
    qConstructor: new () => IQ;
    equals(value: T): JO;
    exists(exists: boolean): JO;
    isIn(values: T[]): JO;
    isNotNull(): JO;
    isNull(): JO;
    notEquals(value: T): JO;
    notIn(values: T[]): JO;
}
export declare abstract class QField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>> implements IQField<IQ, T, JO, IO> {
    childConstructor: new (q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string) => IQField<IQ, T, JO, IO>;
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    operation: IO;
    appliedFunctions: JSONSqlFunctionCall[];
    constructor(childConstructor: new (q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string) => IQField<IQ, T, JO, IO>, q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, fieldType: FieldType, operation: IO);
    protected getFieldKey(): string;
    setOperation(jsonOperation: JO): JO;
    objectEquals<IQF extends IQField<any, any, JOE, IOE>, JOE extends JSONBaseOperation, IOE extends IOperation<any, JOE>>(otherField: IQF, checkValue?: boolean): boolean;
    equals(value: T): JO;
    exists(exists: boolean): JO;
    isNotNull(): JO;
    isNull(): JO;
    isIn(values: T[]): JO;
    notEquals(value: T): JO;
    notIn(values: T[]): JO;
    asc(): JSONFieldInOrderBy;
    desc(): JSONFieldInOrderBy;
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQField<IQ, T, JO, IO>;
    toJSON(): JSONClauseField;
}
