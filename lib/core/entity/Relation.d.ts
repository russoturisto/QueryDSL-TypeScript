/**
 * Created by Papa on 4/26/2016.
 */
export interface IQRelation {
    targetEntityConstructor: Function;
    foreignKeyProperty?: string;
}
export declare class QRelation implements IQRelation {
    targetEntityConstructor: Function;
    foreignKeyProperty: string;
    constructor(targetEntityConstructor: Function, foreignKeyProperty?: string);
}
