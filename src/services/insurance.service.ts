import {BankDetails} from "../interfaces/bankDetails";

export class InsuranceService {
    url = 'https://api.insurance.projects.bbdgrad.com';

    async changePrice(price: number) {
        const payload = {
            electronicsPrice: price
        }
        try {
            const response = await fetch(`${this.url}/price`, {
                method: 'PATCH',
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

    async insureElectronic(personaId: string, amount: number)  {
        const payload = {
            personaId: personaId,
            electronicsAmount: amount
        }
        try {
            const response = await fetch(`${this.url}/api/Electronics`, {
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
}