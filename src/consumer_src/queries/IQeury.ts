export interface IQuery<T, Args extends any[] = []> {
    execute(...args: Args): T;
    validate(...args: Args): boolean;
}