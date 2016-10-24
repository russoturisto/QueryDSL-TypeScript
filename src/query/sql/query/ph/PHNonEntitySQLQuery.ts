import {PHRawSQLQuery} from "../../PHSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHRawNonEntitySQLQuery extends PHRawSQLQuery {
	from: IQEntity[];
	groupBy?: IQField<any, any, any, any, any>[];
	having?: JSONRawValueOperation<any>[],
	limit?: number;
	offset?: number;
}