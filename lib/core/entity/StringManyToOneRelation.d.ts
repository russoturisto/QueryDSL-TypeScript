import { QStringField, IQStringField } from "../field/StringField";
import { IQEntity, IEntityRelationFrom } from "./Entity";
import { IQRelation, EntityRelationType } from "./Relation";
/**
 * Created by Papa on 10/23/2016.
 */
export interface IQStringManyToOneRelation<IQR extends IQEntity, R> extends IQRelation, IQStringField {
}
export declare class QStringManyToOneRelation<IERF extends IEntityRelationFrom, R> extends QStringField implements IQRelation {
    q: IQEntity;
    qConstructor: new () => IQEntity;
    entityName: string;
    fieldName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQEntity;
    relationType: EntityRelationType;
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQEntity);
    getInstance(qEntity?: IQEntity): QStringManyToOneRelation<IERF, R>;
    innerJoin(): IERF;
    leftJoin(): IERF;
    private getNewQEntity(joinType);
}
