import { IQField } from "../field/Field";
import { IQRelation } from "./Relation";
/**
 * Marker interface for all query interfaces
 */
export interface IEntity<IQ extends IQEntity<IQ>> {
    __operator__?: '$and' | '$or';
}
export interface IQEntity<IQ extends IQEntity<IQ>> {
    entityConstructor: Function;
    entityFields: IQField<IQ>[];
    entityRelations: IQRelation<any, any, IQ>[];
    addEntityRelation<IQR extends IQEntity<IQR>, R>(relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<IQF extends IQField<IQ>>(field: IQF): void;
    fields(fields: IQField<IQ>[]): IQ;
}
export declare abstract class QEntity<IQ extends IQEntity<IQ>> implements IQEntity<IQ> {
    entityConstructor: Function;
    name: string;
    private isTemplate;
    private nativeName?;
    entityFields: IQField<IQ>[];
    entityRelations: IQRelation<any, any, IQ>[];
    constructor(entityConstructor: Function, name: string, isTemplate?: boolean, nativeName?: string);
    addEntityRelation<IQR extends IQEntity<IQR>, R>(relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<T, IQF extends IQField<IQ>>(field: IQF): void;
    getQ(): IQ;
    fields(fields: IQField<IQ>[]): IQ;
    abstract toJSON(): any;
}
