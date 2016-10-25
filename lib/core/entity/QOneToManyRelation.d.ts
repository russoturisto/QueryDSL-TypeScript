import { IQEntity } from "./Entity";
import { IQRelation, EntityRelationType } from "./Relation";
/**
 * Created by Papa on 10/25/2016.
 */
export declare class QOneToManyRelation<IQR extends IQEntity, R, IQ extends IQEntity> implements IQRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    propertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new (...args: any[]) => IQR;
    relationType: EntityRelationType;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, propertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new (...args: any[]) => IQR);
    innerJoin(): IQR;
    leftJoin(): IQR;
    private getNewQEntity(joinType);
}
