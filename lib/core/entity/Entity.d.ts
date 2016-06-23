import { IQField } from "../field/Field";
import { IQRelation } from "./Relation";
/**
 * Marker interface for all query interfaces
 */
export interface IEntity<IQ extends IQEntity<IQ>> {
    __operator__?: '$and' | '$or';
}
export interface IQEntity<IQ extends IQEntity<IQ>> {
    __entityConstructor__: Function;
    __entityFields__: IQField<IQ>[];
    __entityRelations__: IQRelation<any, any, IQ>[];
    addEntityRelation<IQR extends IQEntity<IQR>, R>(relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<IQF extends IQField<IQ>>(field: IQF): void;
    fields(fields: IQField<IQ>[]): IQ;
}
export declare abstract class QEntity<IQ extends IQEntity<IQ>> implements IQEntity<IQ> {
    __entityConstructor__: Function;
    __entityName__: string;
    private __isTemplateEntity__;
    private __nativeEntityName__?;
    __entityFields__: IQField<IQ>[];
    __entityRelations__: IQRelation<any, any, IQ>[];
    constructor(__entityConstructor__: Function, __entityName__: string, __isTemplateEntity__?: boolean, __nativeEntityName__?: string);
    addEntityRelation<IQR extends IQEntity<IQR>, R>(relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<T, IQF extends IQField<IQ>>(field: IQF): void;
    getQ(): IQ;
    fields(fields: IQField<IQ>[]): IQ;
    abstract toJSON(): any;
}
