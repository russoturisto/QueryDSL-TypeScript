/**
 * Created by Papa on 4/26/2016.
 */
export declare enum QRelationType {
    ONE_TO_MANY = 0,
    MANY_TO_ONE = 1,
}
export interface IQRelation {
    targetEntityConstructor: Function;
    relationPropertyName: string;
    relationType: QRelationType;
}
export declare class QRelation implements IQRelation {
    targetEntityConstructor: Function;
    relationPropertyName: string;
    relationType: QRelationType;
    constructor(targetEntityConstructor: Function, relationPropertyName: string, relationType: QRelationType);
}
