import { IEntity, IQEntity } from "../../core/entity/Entity";
import { PHJsonSQLUpdate } from "./PHSQLUpdate";
import { SQLDialect } from "./SQLStringQuery";
import { EntityRelationRecord } from "../../core/entity/Relation";
import { SQLStringNoJoinQuery } from "./SQLStringNoJoinQuery";
/**
 * Created by Papa on 10/2/2016.
 */
export declare class SQLStringUpdate<IE extends IEntity> extends SQLStringNoJoinQuery<IE> {
    phJsonUpdate: PHJsonSQLUpdate<IE>;
    constructor(phJsonUpdate: PHJsonSQLUpdate<IE>, qEntity: IQEntity, qEntityMap: {
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
    protected getSetFragment(updateAlias: string, entityName: string, setClauseFragment: IE, embedParameters?: boolean, parameters?: any[]): string;
    protected getSetPropertyColumnName(qEntity: IQEntity, propertyName: string): string;
    private getSetValueFragment<T>(value, entityName, propertyName, typeCheckFunction, embedParameters?, parameters?, conversionFunction?);
}
