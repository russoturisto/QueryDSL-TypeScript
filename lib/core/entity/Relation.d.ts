import { IQEntity } from "./Entity";
import { QueryFragment } from "../QueryFragment";
/**
 * Created by Papa on 4/26/2016.
 */
export declare enum RelationType {
    ONE_TO_MANY = 0,
    MANY_TO_ONE = 1,
}
export interface IQRelation<IQR extends IQEntity<IQR>, R, IQ extends IQEntity<IQ>> {
    q: IQ;
    qConstructor: new () => IQ;
    relationPropertyName: string;
    relationType: RelationType;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new () => IQR;
}
export declare class QRelation<IQR extends IQEntity<IQR>, R, IQ extends IQEntity<IQ>> extends QueryFragment implements IQRelation<IQR, R, IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    relationType: RelationType;
    relationPropertyName: string;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new () => IQR;
    constructor(q: IQ, qConstructor: new () => IQ, relationType: RelationType, relationPropertyName: string, relationEntityConstructor: new () => R, relationQEntityConstructor: new () => IQR);
}
