import {BankDetails} from "../consumer_src/interfaces/messages/bankDetails";

export class BankService {
    async processPayment(totalCost: number, orderRef: string, bankDetails: BankDetails) {
        console.log('Processing payment');
        return true;
    }
}