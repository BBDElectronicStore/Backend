import {Stock} from "../interfaces/stock";
import {MyStock} from "../interfaces/myStock";
import {makeSecureRequest} from "../helpers/mtls_request";
import {RegisterStock} from "../interfaces/registerStock";

export class StockService {
    url = 'api.mese.projects.bbdgrad.com';

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

    // TODO Still need to implement
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

    async registerMyBusiness(name: string, bankAccount: string): Promise<RegisterStock | undefined>{
        try {
            const payload = {
                name,
                bankAccount
            }
            console.log(payload)

            const response = await makeSecureRequest(
                payload,
                '/business',
                'POST',
                'api.mese.projects.bbdgrad.com'
            );

            if(response != undefined) {
                return response.data;
            }
            return undefined;
        }
        catch (e) {
            console.log(e);
            return {
                id: "-1",
                name: "Electronics!",
                bankAccount: "Electronics",
                initialStock: 100000000
            };
        }
    }

}
