import {ICommand} from "./ICommand";
import {OrderRepository} from "../repositories/order.repository";


export class PlaceOrderCommand implements ICommand<Promise<{ order_id: number, total_cost: number } | null>, [customerId: number, quantity: number, time: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(customerId: number, quantity: number, time: string) {
        console.log(customerId, quantity);
        if(this.validate(customerId, quantity, time))
            return await this.repository.placeOrderAndGetTotalCost(quantity, customerId, time);
        return null;
    }

    validate(customerId: number, quantity: number, time: string): boolean {
        if(!customerId || !quantity)
            return false;
        return !(customerId < 0 || quantity < 0);
    }
}