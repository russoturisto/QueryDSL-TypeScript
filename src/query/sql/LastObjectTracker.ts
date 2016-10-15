import {SQLDataType} from "./SQLStringQuery";
/**
 * Created by Papa on 10/14/2016.
 */

export class LastObjectTracker {
    lastObjectMap:{[alias:string]:any} = {};
    currentObjectMap:{[alias:string]:any} = {};
    objectEqualityMap:{[alias:string]:boolean} = {};

    addProperty(entityAlias:string,
                resultObject:any,
                dataType:SQLDataType,
                propertyName:string):void {
        if (this.isDifferent(entityAlias, resultObject, propertyName)) {
            return;
        }
        let lastObject = this.lastObjectMap[entityAlias];
        // Both of the properties are truthy
        switch (dataType) {
            case SQLDataType.DATE:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName].getTime() === resultObject[propertyName].getTime());
                return;
            default:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName] === resultObject[propertyName]);
                return;
        }
    }

    addManyToOneReference(entityAlias:string,
                                  resultObject:any,
                                  propertyName:string,
                                  manyToOneIdField:string):void {
        if (this.isDifferent(entityAlias, resultObject, propertyName)) {
            return;
        }
        let lastObject = this.lastObjectMap[entityAlias];
        this.objectEqualityMap[entityAlias] = (lastObject[propertyName][manyToOneIdField] === resultObject[propertyName][manyToOneIdField]);
    }

    private isDifferent(entityAlias:string,
                        resultObject:any,
                        propertyName:string):boolean {
        // If we already know that this is a new object, no need to keep on checking
        if (!this.objectEqualityMap[entityAlias]) {
            return true;
        }
        let lastObject = this.lastObjectMap[entityAlias];
        // If there was no last object
        if (!lastObject) {
            this.objectEqualityMap[entityAlias] = true;
            return true;
        }
        // Types are guaranteed to be the same, so:
        // If the last property is not there or is falsy
        if (!lastObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!resultObject[propertyName];
            return false;
        } // If the current property is not there or is falsy
        else if (!resultObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!lastObject[propertyName];
            return false;
        }

    }

}