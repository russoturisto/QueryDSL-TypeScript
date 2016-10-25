import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {DateOperation, JSONRawDateOperation, IDateOperation} from "../operation/DateOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 8/11/2016.
 */

export interface IQDateField<IQ extends IQEntity> extends IQField<IQ, Date, JSONRawDateOperation<IQ>, IDateOperation<IQ>, IQDateField<IQ>> {

    greaterThan(
        value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ>;

    greaterThanOrEquals(
      value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ>;

    lessThan(
      value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ>;

    lessThanOrEquals(
      value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ>;

}

export class QDateField<IQ extends IQEntity> extends QField<IQ, Date, JSONRawDateOperation<IQ>, IDateOperation<IQ>, IQDateField<IQ>> implements IQDateField<IQ> {

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(QDateField, q, qConstructor, entityName, fieldName, FieldType.DATE, new DateOperation<IQ>());
    }

    greaterThan(
      value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ> {
        return this.setOperation(this.operation.greaterThan(value));
    }

    greaterThanOrEquals(
      value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ> {
        return this.setOperation(this.operation.greaterThanOrEquals(value));
    }

    lessThan(
      value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ> {
        return this.setOperation(this.operation.lessThan(value));
    }

    lessThanOrEquals(
      value:Date | IQDateField<IQ> | PHRawFieldSQLQuery<IQDateField<IQ>>
    ):JSONRawDateOperation<IQ> {
        return this.setOperation(this.operation.lessThanOrEquals(value));
    }

}

export class QDateFunction extends QDateField<any> {
    constructor() {
        super(null, null, null, null);
    }

    applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQDateField<any> {
        let functionApplicable = new QDateFunction();
        functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
        functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

        return functionApplicable;
    }

    toJSON(): JSONClauseField {
        return {
            __appliedFunctions__: this.__appliedFunctions__,
            type: JSONClauseObjectType.FIELD_FUNCTION
        };
    }
}