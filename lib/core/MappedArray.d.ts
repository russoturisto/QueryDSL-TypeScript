/**
 * Created by Papa on 10/14/2016.
 */
export declare class MappedEntityArray<E> extends Array {
    private keyField;
    dataMap: {
        [id: string]: E;
    };
    constructor(keyField: string | number);
    clear(): void;
    putAll(values: E[]): void;
    put(value: E): void;
    get(key: string | number): E;
    delete(key: string | number): E;
}
