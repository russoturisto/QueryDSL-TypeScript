/**
 * Created by Papa on 10/15/2016.
 */
export interface ManyToOneStubReference {
    mtoEntityName: string;
    mtoParentObject: any;
    mtoRelationField: string;
    otmEntityField: string;
    otmEntityId: string | number;
    otmEntityName: string;
}
export declare class BridgedQueryMtoMapper {
    mtoStubReferenceMap: {
        [mtoEntityName: string]: {
            [mtoEntityId: string]: {
                [mtoPropertyName: string]: ManyToOneStubReference;
            };
        };
    };
    addMtoReference(mtoStubReference: ManyToOneStubReference, mtoEntityId: string | number): void;
    populateMtos(entityMap: {
        [entityName: string]: {
            [entityId: string]: any;
        };
    }): void;
}
