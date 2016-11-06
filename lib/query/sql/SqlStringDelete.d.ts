import { IQEntity } from "../../core/entity/Entity";
import { EntityRelationRecord } from "../../core/entity/Relation";
import { SQLDialect } from "./SQLStringQuery";
import { PHJsonSQLDelete } from "./PHSQLDelete";
import { SQLStringNoJoinQuery } from "./SQLStringNoJoinQuery";
/**
 * Created by Papa on 10/2/2016.
 */
export declare class SQLStringDelete extends SQLStringNoJoinQuery {
    phJsonDelete: PHJsonSQLDelete;
    constructor(phJsonDelete: PHJsonSQLDelete, qEntity: IQEntity, qEntityMapByName: {
        [entityName: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect);
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
}
