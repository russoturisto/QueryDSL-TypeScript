import { IQField } from "../field/Field";
import { IQEntity } from "./Entity";
export declare function getNextRootEntityName(): string;
export declare class AliasCache {
    private lastAlias;
    protected aliasPrefix: string;
    constructor();
    getFollowingAlias(): string;
    reset(): void;
}
export declare abstract class AliasMap<T> {
    private aliasCache;
    protected aliasMap: Map<T, string>;
    constructor(aliasCache: AliasCache);
    getNextAlias(object: T): string;
    abstract getExistingAlias(object: T): string;
    hasAliasFor(object: T): boolean;
}
export declare class EntityAliases extends AliasMap<IQEntity> {
    private entityAliasCache;
    private columnAliasCache;
    constructor(entityAliasCache?: AliasCache, columnAliasCache?: AliasCache);
    getNewFieldColumnAliases(): FieldColumnAliases;
    getExistingAlias(entity: IQEntity): string;
}
export declare class FieldColumnAliases extends AliasMap<IQField<any>> {
    protected _entityAliases: EntityAliases;
    constructor(_entityAliases: EntityAliases, aliasCache: AliasCache);
    readonly entityAliases: EntityAliases;
    getExistingAlias(field: IQField<any>): string;
}
