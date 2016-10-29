import { NonEntitySQLStringQuery } from "./NonEntitySQLStringQuery";
import { PHJsonFieldQSLQuery } from "../ph/PHFieldSQLQuery";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
import { SQLDialect } from "../../SQLStringQuery";
/**
 * Created by Papa on 10/29/2016.
 */
export declare class FieldSQLStringQuery extends NonEntitySQLStringQuery<PHJsonFieldQSLQuery> {
    constructor(phJsonQuery: PHJsonFieldQSLQuery, qEntityMapByName: {
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
}
