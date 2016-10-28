import { IEntity, IQEntity } from "../../core/entity/Entity";
import { PHRawUpdate, PHUpdate } from "../PHQuery";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { JSONEntityRelation } from "../../core/entity/Relation";
import { PHAbstractSQLQuery } from "./query/ph/PHAbstractSQLQuery";
/**
 * Created by Papa on 10/2/2016.
 */
export interface PHRawSQLUpdate<IE extends IEntity, IQE extends IQEntity> extends PHRawUpdate<IE> {
    update: IQE;
    set: IE;
    where?: JSONBaseOperation;
}
export interface PHJsonSQLUpdate<IE extends IEntity> {
    update: JSONEntityRelation;
    set: IE;
    where?: JSONBaseOperation;
}
export declare class PHSQLUpdate<IE extends IEntity, IQE extends IQEntity> extends PHAbstractSQLQuery implements PHUpdate<IE> {
    phRawQuery: PHRawSQLUpdate<IE, IQE>;
    constructor(phRawQuery: PHRawSQLUpdate<IE, IQE>);
    toSQL(): PHJsonSQLUpdate<IE>;
}
