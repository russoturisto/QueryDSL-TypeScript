import { IEntity } from "../../../../core/entity/Entity";
import { PHRawSQLQuery, PHSQLQuery } from "../../PHSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
    select: IE;
}
export interface PHRawEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
    select: IE;
}
export declare class PHEntitySQLQuery<IE extends IEntity> implements PHSQLQuery {
    phRawQuery: PHRawEntitySQLQuery<IE>;
    constructor(phRawQuery: PHRawEntitySQLQuery<IE>);
    toJSON(): PHJsonEntitySQLQuery<IE>;
}
