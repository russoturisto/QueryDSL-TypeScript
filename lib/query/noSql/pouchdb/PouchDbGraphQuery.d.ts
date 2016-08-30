import { RelationRecord } from "../../../core/entity/Relation";
import { PHJsonGraphQuery } from "../PHGraphQuery";
import { IEntity } from "../../../core/entity/Entity";
import { JSONBaseOperation } from "../../../core/operation/Operation";
export declare const CLOUDANT_ENTITY: string;
export interface PouchDbFindQuery {
    selector: JSONBaseOperation;
    fields: string[];
    sort: string[];
}
export declare class PouchDbGraphQuery<IE extends IEntity> {
    private entityName;
    private queryKey;
    private entitiesRelationPropertyMap;
    private entitiesPropertyTypeMap;
    childSelectJson: {
        [propertyName: string]: any;
    };
    childQueries: {
        [propertyName: string]: PouchDbGraphQuery<any>;
    };
    fields: string[];
    queryJson: PHJsonGraphQuery<IE>;
    selector: any;
    sort: string[];
    queriesInOrder: PouchDbFindQuery[];
    queryMap: {
        [queryKey: string]: PouchDbFindQuery;
    };
    constructor(entityName: string, queryKey: string, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, queryJson: PHJsonGraphQuery<IE>);
    parseAll(): void;
    parse(queryJson: PHJsonGraphQuery<any>): PouchDbFindQuery;
    extractSubQueries(): void;
    addField(fieldName: string): void;
    extractSelectFields(queryJson: any): void;
}
