import {IQuery} from "./IQeury";
import {Order} from "../interfaces/order";
import {CustomerRepository} from "../repositories/customer.repository";
import {Customer} from "../interfaces/customer";


export class GetCustomerOrderQuery implements IQuery<Promise<Customer[]>> {

    constructor(private readonly repository: CustomerRepository) {}

    async execute() {
        return await this.repository.getAllCustomers();
    }

    validate(): boolean {
        return true;
    }
}