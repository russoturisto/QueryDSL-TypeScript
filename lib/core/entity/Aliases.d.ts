import { IQField } from "../field/Field";
export declare function getNextRootEntityName(): string;
export declare class ColumnAliases {
    private aliasPrefix;
    private lastAlias;
    private fields;
    constructor(aliasPrefix?: string);
    getNextAlias(field: IQField<any>): string;
    hasField(field: IQField<any>): boolean;
    clearFields(): void;
}
