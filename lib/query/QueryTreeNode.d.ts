import { QEntity } from "../core/entity/Entity";
import { JSONRelation } from "../core/entity/Relation";
/**
 * Created by Papa on 8/23/2016.
 */
export declare enum RelationType {
    ONE_TO_MANY = 0,
    MANY_TO_ONE = 1,
}
export declare class QueryTreeNode {
    qEntity: QEntity<any>;
    relationToParent: JSONRelation;
    relationToParentType: RelationType;
    children: QueryTreeNode[];
    constructor(qEntity: QEntity<any>, relationToParent: JSONRelation, relationToParentType: RelationType);
}
