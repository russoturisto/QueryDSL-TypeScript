import { IEntity } from "../../../../core/entity/Entity";
import { PHRawSQLQuery } from "../../PHSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHRawEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
    select: IE;
}
