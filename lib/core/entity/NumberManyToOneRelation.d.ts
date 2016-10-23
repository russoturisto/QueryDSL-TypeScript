import { QNumberField, IQNumberField } from "../field/NumberField";
import { IQEntity } from "./Entity";
import { JSONSqlFunctionCall } from "../field/Functions";
import { IQRelation, RelationType } from "./Relation";
import { JSONClauseField } from "../field/Appliable";
/**
 * Created by Papa on 10/23/2016.
 */
export interface IQNumberManyToOneRelation<IQR extends IQEntity, R, IQ extends IQEntity> extends IQRelation<IQR, R, IQ>, IQNumberField<IQR> {
}
export declare class QNumberManyToOneRelation<IQR extends IQEntity, R, IQ extends IQEntity> extends QNumberField<IQR> {
    q: IQR;
    qConstructor: new () => IQR;
    entityName: string;
    fieldName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    relationType: RelationType;
    constructor(q: IQR, qConstructor: new () => IQR, entityName: string, fieldName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQNumberManyToOneRelation<IQR, R, IQ>;
    toJSON(): JSONClauseField;
}
