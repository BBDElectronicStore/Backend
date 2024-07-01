import { makeSecureRequest } from "../helpers/mtls_request";

export class CommercialBankService {
    url = 'https://api.commercialbank.projects.bbdgrad.com';

    async getCurrentBalance(): Promise<number> {
        try {
            const response = await makeSecureRequest(null, '/account/balance', 'GET', 'https://api.commercialbank.projects.bbdgrad.com');
            if (response?.status !== 200) {
                throw new Error(`HTTP error! Status: ${response?.status}`);
            }

            if (response?.data) {
                return response?.data;// TODO - map response 
            }
        
            return -1 ; 
        }
        catch (e) {
            console.log(e);
            return -1;
        }
    }
    async getListOfTransactions(): Promise<any> {
        try {
            
            const response = await makeSecureRequest(null, '/transactions', 'GET', 'https://api.commercialbank.projects.bbdgrad.com');
            if (response?.status !== 200) {
                throw new Error(`HTTP error! Status: ${response?.status}`);
            }
            return response.data; // TODO - map response
        }
        catch (e) {
            console.log(e);
            return [];
        }
    }


}