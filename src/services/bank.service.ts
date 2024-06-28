import {BankDetails} from "../interfaces/bankDetails";

export class BankService {
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
            const response = await fetch(`${this.url}/transactions/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async getCurrentBalance(): Promise<number> {
        return 5000;
    }

}