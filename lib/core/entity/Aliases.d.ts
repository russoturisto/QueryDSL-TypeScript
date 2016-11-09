import { IQField } from "../field/Field";
import { IQEntity } from "./Entity";
import { IQFunction } from "../field/OperableField";
export declare class AliasCache {
    protected aliasPrefix: string;
    private lastAlias;
    constructor(aliasPrefix?: string);
    getFollowingAlias(): string;
    reset(): void;
}
export interface Parameter {
    alias: string;
    type: string;
    value: boolean | Date | number | string;
}
export declare abstract class AliasMap<T, A> {
    protected aliasCache: AliasCache;
    protected aliasMap: Map<T, A>;
    constructor(aliasCache: AliasCache);
    getNextAlias(object: T): string;
    abstract getExistingAlias(object: T): A;
    hasAliasFor(object: T): boolean;
}
export declare class EntityAliases extends AliasMap<IQEntity, string> {
    private columnAliasCache;
    private parameterAliases;
    constructor(entityAliasCache?: AliasCache, columnAliasCache?: AliasCache, parameterAliasCache?: AliasCache);
    getParams(): ParameterAliases;
    getNewFieldColumnAliases(): FieldColumnAliases;
    getExistingAlias(entity: IQEntity): string;
}
export declare class ParameterAliases extends AliasMap<IQFunction<any>, Parameter> {
    constructor(aliasCache: AliasCache);
    getNextAlias(object: IQFunction<any>): string;
    getExistingAlias(field: IQFunction<any>): Parameter;
}
export declare class FieldColumnAliases extends AliasMap<IQField<any>, string> {
    protected _entityAliases: EntityAliases;
    constructor(_entityAliases: EntityAliases, aliasCache: AliasCache);
    readonly entityAliases: EntityAliases;
    getExistingAlias(field: IQField<any>): string;
}
