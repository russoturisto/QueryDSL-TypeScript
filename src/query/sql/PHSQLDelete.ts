import {IEntity, IQEntity, QEntity} from "../../core/entity/Entity";
import {PHRawUpdate, PHRawDelete, PHDelete} from "../PHQuery";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {JSONRelation, RelationRecord} from "../../core/entity/Relation";
/**
 * Created by Papa on 10/2/2016.
 */

export interface PHRawSQLDelete<IE extends IEntity> extends PHRawDelete<IE> {
    deleteFrom: IQEntity;
    where?: JSONBaseOperation;
}

export interface PHJsonSQLDelete<IE extends IEntity> {
    deleteFrom: JSONRelation;
    where?: JSONBaseOperation;
}

export class PHSQLDelete<IE extends IEntity> implements PHDelete<IE> {

    constructor(public phRawQuery:PHRawSQLDelete<IE>,
                public qEntity:QEntity<any>,
                public qEntityMap:{[entityName:string]:QEntity<any>},
                public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
                public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}) {
    }

    toSQL():PHJsonSQLDelete<IE> {
        return {
            deleteFrom: this.phRawQuery.deleteFrom.getRelationJson(),
            where: this.phRawQuery.where
        };
    }
}
