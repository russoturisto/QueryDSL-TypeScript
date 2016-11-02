import { QStringField, IQStringField } from "../field/StringField";
import { IQEntity } from "./Entity";
import { IQRelation, EntityRelationType } from "./Relation";
import { JSONClauseField } from "../field/Appliable";
/**
 * Created by Papa on 10/23/2016.
 */
export interface IQStringManyToOneRelation<IQR extends IQEntity, R> extends IQRelation<IQR, R>, IQStringField {
}
export declare class QStringManyToOneRelation<IQR extends IQEntity, R> extends QStringField implements IQRelation<IQR, R> {
    q: IQR;
    qConstructor: new () => IQR;
    entityName: string;
    fieldName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    relationType: EntityRelationType;
    constructor(q: IQR, qConstructor: new () => IQR, entityName: string, fieldName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    getInstance(): QStringManyToOneRelation<IQR, R>;
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
    toJSON(): JSONClauseField;
}
