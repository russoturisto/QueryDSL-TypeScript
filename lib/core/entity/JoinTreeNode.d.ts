import { JSONRelation } from "./Relation";
/**
 * Created by Papa on 10/18/2016.
 */
export declare class JoinTreeNode {
    jsonRelation: JSONRelation;
    childNodes: JoinTreeNode[];
    parentNode: JoinTreeNode;
    constructor(jsonRelation: JSONRelation, childNodes: JoinTreeNode[], parentNode: JoinTreeNode);
    addChildNode(joinTreeNode: JoinTreeNode): void;
    getEntityRelationChildNode(entityName: string, relationName: string): JoinTreeNode;
}
