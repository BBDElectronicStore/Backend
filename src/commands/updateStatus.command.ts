import {ICommand} from "./ICommand";
import {OrderRepository} from "../repositories/order.repository";


export class UpdateStatusCommand implements ICommand<Promise<number | null>, [orderRef: string, status: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(orderRef: string, status: string) {
        if(!this.validate(orderRef, status))
            throw new Error(`Invalid GUID ${orderRef}`);
        return await this.repository.updateOrderStatus(orderRef, status);
    }

    validate(orderRef: string, status: string): boolean {
        return !(!orderRef || orderRef.length === 0);
    }
}