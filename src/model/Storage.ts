export interface Storage<T> {

    save(entity: T): Promise<void>;

    find(entity: T): Promise<T | null>;

    delete(entity: T): Promise<void>;
}
