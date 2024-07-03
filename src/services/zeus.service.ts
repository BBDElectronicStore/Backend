import {BankDetails} from "../interfaces/bankDetails";
import {makeSecureRequest} from "../helpers/mtls_request";

export class ZeusService {
    url = 'https://api.zeus.projects.bbdgrad.com';

    async getPrice() {
        try {
            const response = await makeSecureRequest(null, '/electronics-price', 'GET', 'api.zeus.projects.bbdgrad.com');
            if (response?.status !== 200) {
                throw new Error(`HTTP error! Status: ${response?.status}`);
            }
            console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
            // The pain and suffering caused by downstreams!
            return {
                value: 100
            };
        }
    }

    async getTime() {
        try {
            const response = await makeSecureRequest(null, '/start-time', 'GET', 'api.zeus.projects.bbdgrad.com');
            if (response?.status !== 200) {
                throw new Error(`HTTP error! Status: ${response?.status}`);
            }
            console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}