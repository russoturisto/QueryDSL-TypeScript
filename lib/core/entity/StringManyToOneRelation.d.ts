import { QStringField, IQStringField } from "../field/StringField";
import { IQEntity } from "./Entity";
import { JSONSqlFunctionCall } from "../field/Functions";
import { IQRelation, EntityRelationType } from "./Relation";
import { JSONClauseField } from "../field/Appliable";
/**
 * Created by Papa on 10/23/2016.
 */
export interface IQStringManyToOneRelation<IQR extends IQEntity, R, IQ extends IQEntity> extends IQRelation<IQR, R, IQ>, IQStringField<IQR> {
}
export declare class QStringManyToOneRelation<IQR extends IQEntity, R, IQ extends IQEntity> extends QStringField<IQR> implements IQRelation<IQR, R, IQ> {
    q: IQR;
    qConstructor: new () => IQR;
    entityName: string;
    fieldName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    relationType: EntityRelationType;
    constructor(q: IQR, qConstructor: new () => IQR, entityName: string, fieldName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQStringManyToOneRelation<IQR, R, IQ>;
    toJSON(): JSONClauseField;
}
