import {ICommand} from "./ICommand";
import {OrderRepository} from "../../repositories/order.repository";
import {Logger} from "../lib/logger";


export class CancelOrderCommand implements ICommand<Promise<number | null>, [correlationId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(correlationId: string) {
        if(!this.validate(correlationId))
            throw new Error(`Invalid GUID ${correlationId}`);
        const status = await this.repository.getOrderStatus(correlationId);
        if(status !== "placed") {
            Logger.error(`[${correlationId}]Cannot cancel order of status: ${status}`);
            return null;
        }
        return await this.repository.updateOrderStatus(correlationId, "cancelled");
    }

    validate(correlationId: string): boolean {
        return !(!correlationId || correlationId.length === 0);
    }
}