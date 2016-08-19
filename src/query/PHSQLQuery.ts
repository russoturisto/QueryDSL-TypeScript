import {IEntity, QEntity} from "../core/entity/Entity";
import {PHQuery, PHJsonQuery} from "./PHQuery";
import {RelationRecord} from "../core/entity/Relation";
import {JSONLogicalOperation} from "../core/operation/LogicalOperation";
import {JSONBaseOperation} from "../core/operation/Operation";
/**
 * Created by Papa on 8/12/2016.
 */

export interface PHJsonSQLQuery<EQ extends IEntity> {
    select: EQ;
    join?: any;
    where?: JSONBaseOperation;
}

export class PHSQLQuery<IE extends IEntity> {

    constructor(
        public phJsonQuery:PHJsonQuery,
        public qEntity:QEntity<any>,
        public qEntityMap:{[entityName:string]:QEntity<any>},
        public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
        public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}
    ) {
    }

    toSQL():string {

        let phWhere = this.phJsonQuery.where;

        return null;
    }

    toWhereFragment(
        operation:JSONBaseOperation
    ):string {
        let sqlLogicalOperator = this.getLogicalOperator(operation);
        if(sqlLogicalOperator) {
            this.toLogicalWhereFragment(operation);
        }

        return null;
    }

    toLogicalWhereFragment(
        logicalOperation:JSONLogicalOperation
    ):string {
        let sqlLogicalOperator;
        for(let operator in logicalOperation) {
            if(sqlLogicalOperator) {
                throw 'Logical operator is already defined';
            }
            switch(operator) {
                case '$and':
                    sqlLogicalOperator = 'AND';
                    break;
                case '$not':
                    sqlLogicalOperator = 'NOT';
                    break;
                case '$or':
                    sqlLogicalOperator = 'OR';
                    break;
            }
        }
        return null;
    }

    toAndOrWhereFragment(
        operations:JSONBaseOperation[],
        sqlLogicalOperator
    ):string {
        return null;
    }

    getLogicalOperator(
        logicalOperation:JSONLogicalOperation
    ):string {
        let sqlLogicalOperator;
        for(let operator in logicalOperation) {
            if(sqlLogicalOperator) {
                throw 'Logical operator is already defined';
            }
            switch(operator) {
                case '$and':
                    sqlLogicalOperator = 'AND';
                    break;
                case '$not':
                    sqlLogicalOperator = 'NOT';
                    break;
                case '$or':
                    sqlLogicalOperator = 'OR';
                    break;
            }
        }
        return sqlLogicalOperator;
    }
}