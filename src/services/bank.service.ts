import {BankDetails} from "../interfaces/bankDetails";

export class BankService {
    async processPayment(totalCost: number, orderRef: string, bankDetails: BankDetails) {
        console.log('Processing payment');
        return true;
    }
}