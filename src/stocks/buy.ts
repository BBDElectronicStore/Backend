import { StockService } from "../services/stock.service";


type Stock = {
    businessId: string,
    sellPrice: number,
    totalListedStock: number
};

export async function buy(budget: number, currentPrice: Stock[], previousPrice: Stock[]) {
    
    let smallestPriceDifference = 0;
    let smallestPriceDifferenceStock: Stock = {
        businessId: "0",
        sellPrice: 9999999,
        totalListedStock: 0
    };

    currentPrice.forEach(currentStock => {
        const previousStock = previousPrice.find(prev => prev.businessId === currentStock.businessId);
        let priceDifference = previousStock ? currentStock.sellPrice - previousStock?.sellPrice : undefined;

        if(priceDifference && priceDifference <= smallestPriceDifference){
            smallestPriceDifferenceStock = currentStock;
        }
    });

    // calculate the amount of stocks that you can buy given their price and your budget
    const maxStocksYouCanBuy = Math.floor(budget / smallestPriceDifferenceStock.sellPrice);
    const canBuy = Math.min(maxStocksYouCanBuy, smallestPriceDifferenceStock.totalListedStock);

    // TODO  run the buy command?
    const stockService = new StockService();
    await stockService.makePurchase("BuyerId", smallestPriceDifferenceStock.businessId, canBuy);
    
}