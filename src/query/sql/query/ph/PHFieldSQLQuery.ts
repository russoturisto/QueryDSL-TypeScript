import {IQField} from "../../../../core/field/Field";
import {PHRawNonEntitySQLQuery} from "./PHNonEntitySQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHRawFieldSQLQuery<IQF extends IQField<any, any, any, any, IQF>>
extends PHRawNonEntitySQLQuery {
	select: IQF;
}

export class PHFieldSQLQuery<IQF extends IQField<any, any, any, any, IQF>> {

	constructor() {
		phRawFieldSqlQuery: PHRawFieldSQLQuery,
			qEntity: QEntity<any>,
			qEntityMap: {[entityName: string]: QEntity<any>},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	}

}