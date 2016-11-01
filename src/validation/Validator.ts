import {JSONRelation} from "../core/entity/Relation";
import {IQEntity} from "../core/entity/Entity";
/**
 * Created by Papa on 11/1/2016.
 */

export interface IValidator {

	validateReadFromEntity( relation: JSONRelation ): void;

	validateReadProperty(
		propertyName: string,
		entityName: string
	): void;

	validateReadQEntityProperty(
		propertyName: string,
		qEntity: IQEntity
	): void;

	validateReadQEntityManyToOneRelation(
		propertyName: string,
		qEntity: IQEntity
	): void;
}

export class QValidator {

	validateReadFromEntity( relation: JSONRelation ) {
	}

	validateReadProperty(
		propertyName: string,
		entityName: string
	): void {
	}

	validateReadQEntityProperty(
		propertyName: string,
		qEntity: IQEntity
	): void {
	}

	validateReadQEntityManyToOneRelation(
		propertyName: string,
		qEntity: IQEntity
	): void {
	}

}

const VALIDATOR = new QValidator();

export function getValidator(
	qEntityMapByName: {[entityName: string]: IQEntity}
): IValidator {
	return VALIDATOR;
}