import { IQEntity } from "./Entity";
import { IQRelation, EntityRelationType } from "./Relation";
/**
 * Created by Papa on 10/25/2016.
 */
export declare class QOneToManyRelation<IQR extends IQEntity, R> implements IQRelation<IQR, R> {
    q: IQEntity;
    qConstructor: new () => IQEntity;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    relationType: EntityRelationType;
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
}
