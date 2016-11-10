import { SQLStringWhereBase } from "./SQLStringWhereBase";
import { IQEntity } from "../../core/entity/Entity";
import { JSONEntityRelation, EntityRelationRecord } from "../../core/entity/Relation";
import { SQLDialect } from "./SQLStringQuery";
/**
 * Created by Papa on 10/2/2016.
 */
export declare abstract class SQLStringNoJoinQuery extends SQLStringWhereBase {
    protected qEntity: IQEntity;
    constructor(qEntity: IQEntity, qEntityMap: {
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
    protected getTableFragment(fromRelation: JSONEntityRelation): string;
}
