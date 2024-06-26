export interface IConsume<T, U> {
    successHandler(msg: T): void;
    errorHandler(msg: U): void;
}