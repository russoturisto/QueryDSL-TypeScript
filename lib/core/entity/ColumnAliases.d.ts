export declare class ColumnAliases {
    numFields: number;
    private lastAlias;
    private columnAliasMap;
    addAlias(tableAlias: string, propertyName: string): string;
    getAlias(tableAlias: string, propertyName: string): string;
    private getAliasKey(tableAlias, propertyName);
    private getNextAlias();
}
