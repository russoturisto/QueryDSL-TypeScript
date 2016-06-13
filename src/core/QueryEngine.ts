import {IQEntity} from "./entity/Entity";
/**
 * Created by Papa on 6/11/2016.
 */

export interface IQueryEngine {

	createQuery<IQE extends IQEntity<IQE>>(
		queryDefinition:IQE
	):any;

}

export abstract class QueryEngine {

}