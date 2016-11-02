import { QNumberField, IQNumberField } from "../field/NumberField";
import { IQEntity } from "./Entity";
import { IQRelation, EntityRelationType } from "./Relation";
import { JSONClauseField } from "../field/Appliable";
/**
 * Created by Papa on 10/23/2016.
 */
export interface IQNumberManyToOneRelation<IQR extends IQEntity, R> extends IQRelation<IQR, R>, IQNumberField {
}
export declare class QNumberManyToOneRelation<IQR extends IQEntity, R extends IQEntity> extends QNumberField implements IQRelation<IQR, R> {
    q: IQR;
    qConstructor: new () => IQR;
    entityName: string;
    fieldName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    relationType: EntityRelationType;
    constructor(q: IQR, qConstructor: new () => IQR, entityName: string, fieldName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    getInstance(): QNumberManyToOneRelation<IQR, R>;
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
    toJSON(): JSONClauseField;
}
