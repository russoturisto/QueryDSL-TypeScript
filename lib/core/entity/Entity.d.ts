/**
 * Created by Papa on 4/21/2016.
 */
import { IQField } from "../field/Field";
import { IQRelation } from "./Relation";
/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
    __operator__?: '$and' | '$or';
}
export interface IQEntity {
    __entityConstructor__: {
        new (): any;
    };
    __entityFields__: IQField<IQEntity>[];
    __entityName__: string;
    __entityRelations__: IQRelation<IQEntity, any, IQEntity>[];
    addEntityRelation<IQR extends IQEntity, R>(relation: IQRelation<IQR, R, IQEntity>): void;
    addEntityField<IQF extends IQField<IQEntity>>(field: IQF): void;
    fields(fields: IQField<IQEntity>[]): IQEntity;
}
export declare abstract class QEntity<IQ extends IQEntity> implements IQEntity {
    __entityConstructor__: {
        new (): any;
    };
    __entityName__: string;
    private __isTemplateEntity__;
    private __nativeEntityName__;
    __entityFields__: IQField<IQ>[];
    __entityRelations__: IQRelation<any, any, IQ>[];
    constructor(__entityConstructor__: {
        new (): any;
    }, __entityName__: string, __isTemplateEntity__?: boolean, __nativeEntityName__?: string);
    addEntityRelation<IQR extends IQEntity, R>(relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<T, IQF extends IQField<IQ>>(field: IQF): void;
    getQ(): IQ;
    fields(fields: IQField<IQ>[]): IQ;
    abstract toJSON(): any;
}
