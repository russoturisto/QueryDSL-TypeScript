import { IQField } from "../field/Field";
export declare function getNextRootEntityName(): string;
export declare class ColumnAliases {
    private lastAlias;
    protected aliasPrefix: string;
    getFollowingAlias(): string;
}
export declare class EntityColumnAliases extends ColumnAliases {
    private columnAliasMap;
    numFields: number;
    addAlias(tableAlias: string, propertyName: string): string;
    resetReadIndexes(): void;
    getAlias(tableAlias: string, propertyName: string): string;
    private getAliasKey(tableAlias, propertyName);
}
export declare class FieldColumnAliases extends ColumnAliases {
    private aliasMap;
    getNextAlias(field: IQField<any>): string;
    getExistingAlias(field: IQField<any>): string;
    hasField(field: IQField<any>): boolean;
    clearFields(): void;
}
