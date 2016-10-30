export declare function getNextRootEntityName(): string;
export declare class ColumnAliases {
    numFields: number;
    private lastAlias;
    private columnAliasMap;
    addAlias(tableAlias: string, propertyName: string): string;
    resetReadIndexes(): void;
    getAlias(tableAlias: string, propertyName: string): string;
    private getAliasKey(tableAlias, propertyName);
    private getNextAlias();
}
