export interface MessageBody<T> {
    name: string;
    content: T;
    correlationId?: string;
}