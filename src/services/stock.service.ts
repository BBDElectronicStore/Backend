import {Stock} from "../interfaces/stock";
import {MyStock} from "../interfaces/myStock";

export class StockService {
    url = 'https://api.mese.projects.bbdgrad.com';

    async getStocks(): Promise<Stock[]> {
        try {
            const response = await fetch(`${this.url}/market/listings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (e) {
            console.log(e);
            return [];
        }
        // return [
        //     {
        //         businessId: "1",
        //         SellPrice: 100,
        //         totalListedStock: 10000
        //     },
        //     {
        //         businessId: "2",
        //         SellPrice: 50,
        //         totalListedStock: 10000
        //     }
        // ]
    }


    async makePurchase(buyerId: string, businessId: string, stockAmount: number) {
        const body = {
            buyerId,
            businessId,
            stockAmount
          }

        try {
            const response = await fetch(`${this.url}/stocks/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
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
            const response = await fetch(`${this.url}/stocks/sell`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}
