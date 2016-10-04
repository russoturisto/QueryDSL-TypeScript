import {IEntity, IQEntity, QEntity} from "../../core/entity/Entity";
import {PHRawUpdate, PHUpdate} from "../PHQuery";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {JSONRelation, RelationRecord} from "../../core/entity/Relation";
/**
 * Created by Papa on 10/2/2016.
 */

export interface PHRawSQLUpdate<IE extends IEntity> extends PHRawUpdate<IE> {
    update: IQEntity;
    set: IE;
    where?: JSONBaseOperation;
}

export interface PHJsonSQLUpdate<IE extends IEntity> {
    update: JSONRelation;
    set: IE;
    where?: JSONBaseOperation;
}

export class PHSQLUpdate<IE extends IEntity> implements PHUpdate<IE> {

    constructor(public phRawQuery:PHRawSQLUpdate<IE>,
                public qEntity:QEntity<any>,
                public qEntityMap:{[entityName:string]:QEntity<any>},
                public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
                public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}) {
    }

    toSQL():PHJsonSQLUpdate<IE> {
        return {
            update: this.phRawQuery.update.getRelationJson(),
            set: this.phRawQuery.set,
            where: this.phRawQuery.where
        };
    }
}