import { IEntity } from "../core/entity/Entity";
/**
 * Created by Papa on 8/15/2016.
 */
export interface PHJsonQuery<EQ extends IEntity> {
    query: any;
    fields: any;
}
export declare class PHQueryDsl {
    constructor();
}
