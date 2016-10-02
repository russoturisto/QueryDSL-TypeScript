import { IEntity, IQEntity } from "../../core/entity/Entity";
import { RelationRecord } from "../../core/entity/Relation";
import { SQLDialect } from "./SQLStringQuery";
import { PHJsonSQLDelete } from "./PHSQLDelete";
import { SQLStringNoJoinQuery } from "./SQLStringNoJoinQuery";
/**
 * Created by Papa on 10/2/2016.
 */
export declare class SQLStringDelete<IE extends IEntity> extends SQLStringNoJoinQuery<IE> {
    phJsonDelete: PHJsonSQLDelete<IE>;
    constructor(phJsonDelete: PHJsonSQLDelete<IE>, qEntity: IQEntity, qEntityMap: {
        [entityName: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect);
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
}
