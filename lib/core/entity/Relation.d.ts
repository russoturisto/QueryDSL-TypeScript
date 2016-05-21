import { IQEntity, QEntity } from "./Entity";
import { QueryFragment } from "../QueryFragment";
/**
 * Created by Papa on 4/26/2016.
 */
export declare enum RelationType {
    ONE_TO_MANY = 0,
    MANY_TO_ONE = 1,
}
export interface IQRelation<IQR extends IQEntity<IQR>, R, IQ extends IQEntity<IQ>> {
    owningQEntity: IQ;
    relationPropertyName: string;
    relationType: RelationType;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new () => IQR;
}
export declare class QRelation<QR extends QEntity<QR>, R, Q extends QEntity<Q>> extends QueryFragment implements IQRelation<QR, R, Q> {
    owningQEntity: Q;
    relationPropertyName: string;
    relationType: RelationType;
    relationEntityConstructor: new () => R;
    relationQEntityConstructor: new () => QR;
    constructor(owningQEntity: Q, relationPropertyName: string, relationType: RelationType, relationEntityConstructor: new () => R, relationQEntityConstructor: new () => QR);
}
