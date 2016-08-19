import { RelationRecord } from "../../core/entity/Relation";
export declare const CLOUDANT_ENTITY: string;
export interface JoinField {
    getJoinCount(): number;
}
export declare class JoinFieldNode implements JoinField {
    private entityName;
    private fieldName;
    private operator;
    constructor(entityName: string, fieldName: string, operator: string);
    getJoinCount(): number;
}
export declare class JoinFieldJunction implements JoinField {
    private children;
    private operator;
    constructor(children: JoinField[], operator: string);
    getJoinCount(): number;
}
/**
 * Query implementation for the unified format where both select and where clauses are in the
 * same JSON tree.
 */
export declare class PouchDbQueryAllInOne {
    private entityName;
    private entitiesRelationPropertyMap;
    private entitiesPropertyTypeMap;
    childSelectJson: {
        [propertyName: string]: any;
    };
    childQueries: {
        [propertyName: string]: PouchDbQueryAllInOne;
    };
    joinFields: JoinField[];
    fields: string[];
    queryJson: any;
    selector: any;
    sort: string[];
    topLevelArray: any[];
    topLevelOperator: string;
    constructor(entityName: string, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, queryJson: any);
    parse(): void;
    extractSubQueries(): void;
    addField(fieldName: string): void;
    extractJoinFields(): void;
    extractJoinField(fieldName: string, fragment: any): JoinField;
    extractSelectFields(queryJson: any): void;
    extractFieldOperators(): void;
    /**
     *
     * @param fieldName
     * @param fragment
     *
     * Convert:
     *
     * field: {
     *   $or: [
     *     { $eq: 1 },
     *     { $and: [
     *       { $not: { $lt: 20 } },
     *       { $ne: 2 }
     *     ] }
     *   ]
     * }
     *
     * To:
     *
     * $or: [
     *   { field: { $eq: 1 },
     *   { $and: [
     *     { field: { $not: { $lt: 20 } },
     *     { field: { $ne: 2 }
     *     ]
     *   ]}
     * }
     *
     * Scan for Logical Operators and if present move field reference to just ouside the non-logical operators.
     */
    private flipFieldOperators(fieldName, fragment);
}
