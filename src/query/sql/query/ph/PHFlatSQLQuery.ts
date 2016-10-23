import {PHSQLQuery, PHRawNonEntitySQLQuery, PHJsonFlatSQLQuery} from "../../PHSQLQuery";
import {QEntity} from "../../../../core/entity/Entity";
import {JSONClauseObject} from "../../../../core/field/Appliable";
import {RelationRecord} from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/23/2016.
 */

export class PHFlatSQLQuery implements PHSQLQuery {

    constructor(
        public phRawQuery: PHRawNonEntitySQLQuery,
        public qEntity: QEntity<any>,
        public qEntityMap: {[entityName: string]: QEntity<any>},
        public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
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