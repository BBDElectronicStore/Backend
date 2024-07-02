import {Stock} from "../interfaces/stock";
import {MyStock} from "../interfaces/myStock";
import { makeSecureRequest } from "../helpers/mtls_request";

export class StockService {
    url = 'https://api.mese.projects.bbdgrad.com';

    async getStocks(): Promise<Stock[]> {
        try {
            const response = await makeSecureRequest(null, '/market/listings', 'GET', 'api.mese.projects.bbdgrad.com');
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


    async makePurchase(buyerId: string, businessId: string, stockAmount: number) {
        const body = {
            buyerId,
            businessId,
            stockAmount
          }

        try {
            const response = await makeSecureRequest(body, '/stocks/buy', 'POST', 'api.mese.projects.bbdgrad.com');
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

    async getMyStocks(userId: string): Promise<MyStock[]> {
        return [
            {
                businessId: "1",
                ownedStock: 100,
                listedStock: 5
            },
            {
                businessId: "2",
                ownedStock: 50,
                listedStock: 5
            }
        ]
    }

    async sellStock(businessId: string, stockAmount: number) {
        try {
            const payload = {
                businessId,
                stockAmount
            }
            const response = await makeSecureRequest(payload, '/stocks/sell', 'POST', 'api.mese.projects.bbdgrad.com');
            if (response?.status !== 200) {
                throw new Error(`HTTP error! Status: ${response?.status}`);
            }
            return response.data; // TODO - map response and check if request succeeded
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}
