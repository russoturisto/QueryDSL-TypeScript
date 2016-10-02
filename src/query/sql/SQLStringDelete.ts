import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {IEntity, IQEntity} from "../../core/entity/Entity";
/**
 * Created by Papa on 10/2/2016.
 */

export class SQLStringDelete<IE extends IEntity> extends SQLStringWhereBase<IE> {

    toSQL(
        embedParameters: boolean = true,
        parameters: any[] = null
    ): string {
        let entityName = this.qEntity.__entityName__;

        let joinQEntityMap: {[alias: string]: IQEntity} = {};
        let fromFragment = this.getFromFragment(joinQEntityMap, this.joinAliasMap, embedParameters, parameters);
        let whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap, embedParameters, parameters);

        return `DELETE
FROM
${fromFragment}
WHERE
${whereFragment}`;
    }

}