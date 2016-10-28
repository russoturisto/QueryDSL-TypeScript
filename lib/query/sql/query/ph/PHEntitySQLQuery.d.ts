import { IEntity, IFrom } from "../../../../core/entity/Entity";
import { PHRawSQLQuery, PHSQLQuery, PHJsonCommonSQLQuery, PHJsonLimitedSQLQuery } from "../../PHSQLQuery";
import { PHMappableSQLQuery } from "./PHMappedSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonEntitySQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
    select: IE;
}
export interface PHRawEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
    from?: IFrom[];
    select: IE;
}
export declare class PHEntitySQLQuery<IE extends IEntity> extends PHMappableSQLQuery implements PHSQLQuery {
    phRawQuery: PHRawEntitySQLQuery<IE>;
    constructor(phRawQuery: PHRawEntitySQLQuery<IE>);
    toJSON(): PHJsonEntitySQLQuery<IE>;
}
export interface PHJsonLimitedEntitySQLQuery<IE extends IEntity> extends PHJsonEntitySQLQuery<IE>, PHJsonLimitedSQLQuery {
}
export interface PHRawLimitedEntitySQLQuery<IE extends IEntity> extends PHRawEntitySQLQuery<IE>, PHJsonLimitedSQLQuery {
}
export declare class PHLimitedEntitySQLQuery<IE extends IEntity> extends PHEntitySQLQuery<IE> {
    phRawQuery: PHRawLimitedEntitySQLQuery<IE>;
    constructor(phRawQuery: PHRawLimitedEntitySQLQuery<IE>);
    toJSON(): PHJsonLimitedEntitySQLQuery<IE>;
}
