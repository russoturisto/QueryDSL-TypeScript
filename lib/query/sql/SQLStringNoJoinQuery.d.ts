import { SQLStringWhereBase } from "./SQLStringWhereBase";
import { JSONEntityRelation } from "../../core/entity/Relation";
import { JoinTreeNode } from "../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/2/2016.
 */
export declare abstract class SQLStringNoJoinQuery extends SQLStringWhereBase {
    getJoinNodeMap(): {
        [alias: string]: JoinTreeNode;
    };
    protected getTableFragment(fromRelation: JSONEntityRelation): string;
}
