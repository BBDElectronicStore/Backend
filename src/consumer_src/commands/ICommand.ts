export interface ICommand<T, Args extends unknown[] = []> {
    execute(...args: Args): T;
    validate(...args: Args): boolean;
}