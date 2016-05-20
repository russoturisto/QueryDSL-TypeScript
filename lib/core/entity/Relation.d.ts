import { IQEntity } from "./Entity";
import { QueryFragment } from "../QueryFragment";
/**
 * Created by Papa on 4/26/2016.
 */
export declare enum QRelationType {
    ONE_TO_MANY = 0,
    MANY_TO_ONE = 1,
}
export interface IQRelation<IQR extends IQEntity<IQR>> {
    relationPropertyName: string;
    relationType: QRelationType;
    targetEntityConstructor: Function;
    targetQEntity: IQR;
}
export declare class QRelation<IQR extends IQEntity<IQR>> extends QueryFragment implements IQRelation<IQR> {
    relationPropertyName: string;
    relationType: QRelationType;
    targetEntityConstructor: Function;
    targetQEntity: IQR;
    constructor(relationPropertyName: string, relationType: QRelationType, targetEntityConstructor: Function, targetQEntity: IQR);
}
