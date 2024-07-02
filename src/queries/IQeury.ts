export interface IQuery<T, Args extends unknown[] = []> {
    execute(...args: Args): T;
    validate(...args: Args): boolean;
}