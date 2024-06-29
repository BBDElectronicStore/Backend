import { StockService } from "../services/stock.service";
import {Stock} from "../interfaces/stock";


export async function buy(budget: number, currentPrice: Stock[], previousPrice: Stock[]) {
    
    let smallestPriceDifference = 0;
    let smallestPriceDifferenceStock: Stock = {
        businessId: "0",
        SellPrice: 9999999,
        totalListedStock: 0
    };

    currentPrice.forEach(currentStock => {
        const previousStock = previousPrice.find(prev => prev.businessId === currentStock.businessId);
        let priceDifference = previousStock ? currentStock.SellPrice - previousStock?.SellPrice : undefined;

        if(priceDifference && priceDifference <= smallestPriceDifference){
            smallestPriceDifferenceStock = currentStock;
        }
    });

    // calculate the amount of stocks that you can buy given their price and your budget
    const maxStocksYouCanBuy = Math.floor(budget / smallestPriceDifferenceStock.SellPrice);
    const canBuy = Math.min(maxStocksYouCanBuy, smallestPriceDifferenceStock.totalListedStock);

    // TODO  run the buy command?
    const stockService = new StockService();
    await stockService.makePurchase("BuyerId", smallestPriceDifferenceStock.businessId, canBuy);
    
}