import {IQuery} from "./IQeury";
import {Customer} from "../interfaces/customer";
import {OrderRepository} from "../repositories/order.repository";
import {AllOrders} from "../interfaces/allOrders";


export class GetAllOrdersQuery implements IQuery<Promise<AllOrders[]>> {

    constructor(private readonly repository: OrderRepository) {}

    async execute() {
        return await this.repository.getAllOrders();
    }

    validate(): boolean {
        return true;
    }
}