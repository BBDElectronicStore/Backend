import {OrderRepository} from "../../repositories/order.repository";
import {IQuery} from "./IQeury";


export class GetStatusQuery implements IQuery<Promise<string>, [correlationId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(correlationId: string) {
        if(!this.validate(correlationId))
            throw new Error(`Invalid GUID ${correlationId}`);
        return await this.repository.getOrderStatus(correlationId);
    }

    validate(correlationId: string): boolean {
        return !(!correlationId || correlationId.length === 0);
    }
}