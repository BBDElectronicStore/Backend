import {ICommand} from "./ICommand";
import { CustomerRepository } from "../repositories/customer.repository";


export class MakeCustomerCommand implements ICommand<Promise<boolean | null>, [uniquePersonaId: string, personaBankingDetails: string]> {

    constructor(
        private repository: CustomerRepository
    ) {}

    async execute(uniquePersonaId: string, personaBankingDetails: string) {
        const doesExist = await this.repository.doesCustomerExist(uniquePersonaId);
        if(doesExist) {
            throw new Error(`Customer ${uniquePersonaId} already has an account`);
        }
        return await this.repository.addCustomer(uniquePersonaId, personaBankingDetails);
    }

    validate(uniquePersonaId: string): boolean {
        // idk what goes here for this LOL
        return true;
    }
}

