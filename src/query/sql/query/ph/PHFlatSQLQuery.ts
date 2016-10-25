import {PHSQLQuery, PHJsonFlatSQLQuery} from "../../PHSQLQuery";
import {QEntity} from "../../../../core/entity/Entity";
import {JSONClauseObject} from "../../../../core/field/Appliable";
import {EntityRelationRecord} from "../../../../core/entity/Relation";
import {IQField} from "../../../../core/field/Field";
/**
 * Created by Papa on 10/23/2016.
 */

export interface PHRawFlatSQLQuery<IQF extends IQField<any, any, any, any, any>>
extends PHRawNonEntitySQLQuery {
    select: IQF[];
}

export class PHFlatSQLQuery implements PHSQLQuery {

    constructor(
        public phRawQuery: PHRawNonEntitySQLQuery,
        public qEntity: QEntity<any>,
        public qEntityMap: {[entityName: string]: QEntity<any>},
        public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
        public entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
    ) {
    }

    toSQL(): PHJsonFlatSQLQuery {

        let jsonObjectSqlQuery: PHJsonFlatSQLQuery = <PHJsonFlatSQLQuery>getCommonJsonQuery(this.phRawQuery, true);

        let groupBy: JSONClauseObject[] = [];
        if (this.phRawQuery.groupBy) {
            groupBy = this.phRawQuery.groupBy.map(( appliable ) => {
                return appliable.toJSON();
            });
        }

        jsonObjectSqlQuery.groupBy = groupBy;
        jsonObjectSqlQuery.having = this.phRawQuery.having;

        return jsonObjectSqlQuery;

    }

}