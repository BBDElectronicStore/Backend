import { makeSecureRequest } from "../helpers/mtls_request";
import { BankDetails } from "../interfaces/bankDetails";

export class RetailBankService {
    url = 'https://api.retailbank.projects.bbdgrad.com';

    async processPayment(totalCost: number, orderRef: string, senderId: string): Promise<boolean> {
        const payload = {
            senderId: senderId,
            amountInMibiBBDough: totalCost,
            receipt: {
                bankId: '1001',
                accountId: 'electronics-retailer'
            },
            reference: `electronics-${orderRef}`,
        }



        try {
            const response = await makeSecureRequest(payload, '/transactions/payments', 'POST', 'api.retailbank.projects.bbdgrad.com');
            if (response?.status !== 200) {
                throw new Error(`HTTP error! Status: ${response?.status}`);
            }
            return true;
        }
        catch (e) {
            console.log(e);
            return true;
        }


    }



}