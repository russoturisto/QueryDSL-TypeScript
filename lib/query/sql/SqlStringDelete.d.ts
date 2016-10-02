import { SQLStringWhereBase } from "./SQLStringWhereBase";
import { IEntity } from "../../core/entity/Entity";
/**
 * Created by Papa on 10/2/2016.
 */
export declare class SQLStringDelete<IE extends IEntity> extends SQLStringWhereBase<IE> {
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
}
