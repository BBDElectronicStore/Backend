export class StockService {

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

}