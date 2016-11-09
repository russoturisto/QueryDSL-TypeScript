import { QNumberField, IQNumberField } from "../field/NumberField";
import { IQEntity, IEntityRelationFrom } from "./Entity";
import { IQRelation, EntityRelationType } from "./Relation";
/**
 * Created by Papa on 10/23/2016.
 */
export interface IQNumberManyToOneRelation<IQR extends IQEntity, R> extends IQRelation, IQNumberField {
}
export declare class QNumberManyToOneRelation<IERF extends IEntityRelationFrom, R extends IQEntity> extends QNumberField implements IQRelation {
    q: IQEntity;
    qConstructor: new () => IQEntity;
    entityName: string;
    fieldName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQEntity;
    relationType: EntityRelationType;
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQEntity);
    getInstance(qEntity?: IQEntity): QNumberManyToOneRelation<IERF, R>;
    innerJoin(): IERF;
    leftJoin(): IERF;
    private getNewQEntity(joinType);
}
