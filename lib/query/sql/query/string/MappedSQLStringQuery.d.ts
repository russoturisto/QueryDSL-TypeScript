/**
 * Created by Papa on 10/28/2016.
 */
import { PHJsonMappedQSLQuery } from "../ph/PHMappedSQLQuery";
import { SQLDialect, EntityDefaults } from "../../SQLStringQuery";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
import { NonEntitySQLStringQuery } from "./NonEntitySQLStringQuery";
/**
 *
 */
export declare class MappedSQLStringQuery extends NonEntitySQLStringQuery<PHJsonMappedQSLQuery> {
    constructor(phJsonQuery: PHJsonMappedQSLQuery, qEntityMapByName: {
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
    protected getSELECTFragment(entityName: string, selectSqlFragment: string, selectClauseFragment: any, joinTree: JoinTreeNode, entityDefaults: EntityDefaults): string;
}
