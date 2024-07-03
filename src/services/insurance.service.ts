import { makeSecureRequest } from "../helpers/mtls_request";
import {BankDetails} from "../interfaces/bankDetails";

export class InsuranceService {
    url = 'https://api.insurance.projects.bbdgrad.com';

    async changePrice(price: number) {
        const payload = {
            electronicsPrice: price
        }

        try {
            const response = await makeSecureRequest(payload, '/price', 'PATCH', 'api.insurance.projects.bbdgrad.com');
            if (response?.status !== 200) {
                throw new Error(`HTTP error! Status: ${response?.status}`);
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
            amountNew: amount
        }
        try {
            const response = await makeSecureRequest(payload, '/api/electronics', 'PUT', 'api.insurance.projects.bbdgrad.com');
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}