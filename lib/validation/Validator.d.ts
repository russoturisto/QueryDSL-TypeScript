import { JSONRelation } from "../core/entity/Relation";
import { IQEntity } from "../core/entity/Entity";
/**
 * Created by Papa on 11/1/2016.
 */
export interface IValidator {
    validateReadFromEntity(relation: JSONRelation): void;
    validateReadProperty(propertyName: string, entityName: string): void;
    validateReadQEntityProperty(propertyName: string, qEntity: IQEntity): void;
    validateReadQEntityManyToOneRelation(propertyName: string, qEntity: IQEntity): void;
}
export declare class QValidator {
    validateReadFromEntity(relation: JSONRelation): void;
    validateReadProperty(propertyName: string, entityName: string): void;
    validateReadQEntityProperty(propertyName: string, qEntity: IQEntity): void;
    validateReadQEntityManyToOneRelation(propertyName: string, qEntity: IQEntity): void;
}
export declare function getValidator(qEntityMapByName: {
    [entityName: string]: IQEntity;
}): IValidator;
