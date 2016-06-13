import { QueryEngine } from "../core/QueryEngine";
import { IQEntity } from "../core/entity/Entity";
export declare class PouchDbQueryEngine extends QueryEngine {
    createQuery<IQE extends IQEntity<IQE>>(db: pouchDB.IPouchDB, queryDefinition: IQE): any;
}
