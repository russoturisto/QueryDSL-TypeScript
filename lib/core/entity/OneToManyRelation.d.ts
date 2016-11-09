import { IQEntity, IEntityRelationFrom } from "./Entity";
import { IQRelation, EntityRelationType } from "./Relation";
/**
 * Created by Papa on 10/25/2016.
 */
export declare class QOneToManyRelation<IERF extends IEntityRelationFrom, R> implements IQRelation {
    q: IQEntity;
    qConstructor: new () => IQEntity;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQEntity;
    relationType: EntityRelationType;
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQEntity);
    innerJoin(): IERF;
    leftJoin(): IERF;
    private getNewQEntity(joinType);
}
