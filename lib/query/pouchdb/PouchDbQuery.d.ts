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
export declare class PouchDbQuery {
    private entityName;
    private entitiesRelationPropertyMap;
    private entitiesPropertyTypeMap;
    childQueries: PouchDbQuery[];
    joinFields: JoinField[];
    fields: string[];
    queryJson: any;
    selector: any;
    sort: string[];
    topLevelArray: any[];
    topLevelOperator: string;
    constructor(entityName: string, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: string;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, queryJson: any);
    parse(): void;
    extractSubQueries(): void;
    extractJoinFields(): void;
    extractJoinField(fieldName: string, fragment: any): JoinField;
    extractSelectFields(): void;
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