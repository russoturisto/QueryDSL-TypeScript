export declare function getNextRootEntityName(): string;
export declare class ColumnAliases {
    private aliasPrefix;
    private lastAlias;
    constructor(aliasPrefix?: string);
    getNextAlias(): string;
}
