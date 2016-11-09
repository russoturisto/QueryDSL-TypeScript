import { JSONRelation } from "../core/entity/Relation";
import { IQEntity } from "../core/entity/Entity";
/**
 * Created by Papa on 11/1/2016.
 */
export interface IValidator {
    validateReadFromEntity(relation: JSONRelation): void;
    validateReadProperty(propertyName: string, entityName: string): void;
    validateReadQEntityProperty(propertyName: string, qEntity: IQEntity, fieldAlias: string): void;
    validateReadQEntityManyToOneRelation(propertyName: string, qEntity: IQEntity, fieldAlias: string): void;
    addFunctionAlias(functionAlias: string): void;
    addSubQueryAlias(subQueryAlias: string): void;
    validateAliasedFieldAccess(fieldAlias: string): void;
}
export declare class QValidator {
    validateReadFromEntity(relation: JSONRelation): void;
    validateReadProperty(propertyName: string, entityName: string): void;
    validateReadQEntityProperty(propertyName: string, qEntity: IQEntity): void;
    validateReadQEntityManyToOneRelation(propertyName: string, qEntity: IQEntity): void;
    addFunctionAlias(functionAlias: string): void;
    addSubQueryAlias(subQueryAlias: string): void;
    validateAliasedFieldAccess(fieldAlias: string): void;
}
export declare function getValidator(qEntityMapByName: {
    [entityName: string]: IQEntity;
}): IValidator;
