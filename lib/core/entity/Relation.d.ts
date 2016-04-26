import { IQEntity } from "./Entity";
/**
 * Created by Papa on 4/26/2016.
 */
export interface IQRelation<Q extends IQEntity<Q>> {
    targetEntity: Q;
    foreignKeyProperty?: string;
}
export declare class QRelation<Q extends IQEntity<Q>> implements IQRelation<Q> {
    targetEntity: Q;
    foreignKeyProperty: string;
    constructor(targetEntity: Q, foreignKeyProperty?: string);
}
