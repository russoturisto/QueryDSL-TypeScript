import { SQLStringWhereBase } from "./SQLStringWhereBase";
import { IEntity } from "../../core/entity/Entity";
import { JSONRelation } from "../../core/entity/Relation";
import { JoinTreeNode } from "../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/2/2016.
 */
export declare abstract class SQLStringNoJoinQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {
    getJoinNodeMap(): {
        [alias: string]: JoinTreeNode;
    };
    protected getTableFragment(fromRelation: JSONRelation): string;
}
