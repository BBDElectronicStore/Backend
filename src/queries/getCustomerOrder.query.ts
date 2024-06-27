import {IQuery} from "./IQeury";
import {ProductRepository} from "../repositories/product.repository";
import {OrderRepository} from "../repositories/order.repository";


export class GetCustomerOrderQuery implements IQuery<Promise<any>, [personaId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(personaId: string) {
        return await this.repository.getOrdersByPersonaId(personaId);
    }

    validate(personaId: string): boolean {
        return true;
    }
}