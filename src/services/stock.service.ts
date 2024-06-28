export class StockService {
    url = 'https://api.mese.projects.bbdgrad.com';

    async getStocks() {
        return [
            {
                businessId: 1,
                SellPrice: 100,
                totalListedStock: 10000
            },
            {
                businessId: 2,
                SellPrice: 50,
                totalListedStock: 10000
            }
        ]
    }

    async makePurchase(buyerId: string, businessId: string, stockAmount: number) {
        try {
            const response = await fetch(`${this.url}/stocks/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

           // TODO How to add a body to this
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}
