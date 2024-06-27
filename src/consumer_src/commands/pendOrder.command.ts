import {ICommand} from "./ICommand";
import {OrderRepository} from "../../repositories/order.repository";

export class PendOrderCommand implements ICommand<Promise<number|null>, [correlationId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(correlationId: string) {
        if(!this.validate(correlationId))
            throw new Error(`Invalid GUID ${correlationId}`);
        return await this.repository.updateOrderStatus(correlationId, "pending");
    }

    validate(correlationId: string): boolean {
        return !(!correlationId || correlationId.length === 0);
    }
}