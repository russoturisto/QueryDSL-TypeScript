import {IEntity, IQEntity, QEntity} from "../../core/entity/Entity";
import {PHRawUpdate, PHRawDelete, PHDelete} from "../PHQuery";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {JSONEntityRelation, EntityRelationRecord} from "../../core/entity/Relation";
/**
 * Created by Papa on 10/2/2016.
 */

export interface PHRawSQLDelete<IE extends IEntity> extends PHRawDelete<IE> {
    deleteFrom: IQEntity;
    where?: JSONBaseOperation;
}

export interface PHJsonSQLDelete<IE extends IEntity> {
    deleteFrom: JSONEntityRelation;
    where?: JSONBaseOperation;
}

export class PHSQLDelete<IE extends IEntity> implements PHDelete<IE> {

    constructor(public phRawQuery:PHRawSQLDelete<IE>,
                public qEntity:QEntity<any>,
                public qEntityMap:{[entityName:string]:QEntity<any>},
                public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:EntityRelationRecord}},
                public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}) {
    }

    toSQL():PHJsonSQLDelete<IE> {
        return {
            deleteFrom: this.phRawQuery.deleteFrom.getEntityRelationJson(),
            where: this.phRawQuery.where
        };
    }
}
