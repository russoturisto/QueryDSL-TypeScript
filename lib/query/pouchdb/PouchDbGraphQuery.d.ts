import { PHJsonGraphQuery } from "../PHGraphQuery";
import { IEntity } from "../../core/entity/Entity";
import { JSONBaseOperation } from "../../core/operation/Operation";
export declare const CLOUDANT_ENTITY: string;
export interface PouchDbFindQuery {
    selector: JSONBaseOperation;
    fields: string[];
    sort: string[];
}
export declare class PouchDbGraphQuery<IE extends IEntity> {
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
    queryMap: {
        [entityAndRelationName: string]: PouchDbFindQuery;
    };
    queriesInOrder: PouchDbFindQuery[];
}
