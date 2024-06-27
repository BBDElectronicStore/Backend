import {IQuery} from "./IQeury";
import {ProductRepository} from "../repositories/product.repository";
import {OrderRepository} from "../repositories/order.repository";
import {Order} from "../interfaces/order";


export class GetCustomerOrderQuery implements IQuery<Promise<Order[]>, [personaId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(personaId: string) {
        return await this.repository.getOrdersByPersonaId(personaId);
    }

    validate(personaId: string): boolean {
        return true;
    }
}