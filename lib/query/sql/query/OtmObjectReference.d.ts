import { MappedEntityArray } from "../../../core/MappedEntityArray";
import { ManyToOneStubReference, OneToManyStubReference } from "../QueryBridge";
/**
 * Created by Papa on 10/15/2016.
 */
export declare class BridgedQueryOtmMapper {
    mtoEntityReferenceMap: {
        [otmReferenceEntityName: string]: {
            [otmReferenceId: string]: {
                [otmProperty: string]: MappedEntityArray<any>;
            };
        };
    };
    otmEntityReferenceMap: {
        [otmEntityName: string]: {
            [otmEntityId: string]: any;
        };
    };
    addMtoReference(mtoStubReference: ManyToOneStubReference, mtoEntityId: string | number): void;
    addOtmReference(otmStubReference: OneToManyStubReference, otmEntityId: string | number): void;
    populateOtms(entityMap: {
        [entityName: string]: {
            [entityId: string]: any;
        };
    }, keepMappedEntityArrays: boolean): void;
}
