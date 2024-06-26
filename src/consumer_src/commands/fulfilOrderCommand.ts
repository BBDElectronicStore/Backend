import {ICommand} from "./ICommand";
import {OrderRepository} from "../repositories/order.repository";

export class FulfilOrderCommand implements ICommand<Promise<number|null>, [correlationId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(correlationId: string) {
        if(!this.validate(correlationId))
            throw new Error(`Invalid GUID ${correlationId}`);
        return await this.repository.updateOrderStatus(correlationId, "approved");
    }

    validate(correlationId: string): boolean {
        return !(!correlationId || correlationId.length === 0);
    }
}