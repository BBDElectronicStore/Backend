import {Stock} from "../interfaces/stock";
import {StockService} from "../services/stock.service";

export async function sell(oldStock: Stock[], newStock: Stock[]) {
    const smallestPriceDifferenceStock: Stock = {
        businessId: "0",
        SellPrice: -9999999,
        totalListedStock: 0
    };


    newStock.forEach((currentStock ) => {
        const previousStock = oldStock.find(prev => prev.businessId === currentStock .businessId);

        // if not our stock then
        const priceDifference = previousStock ? currentStock.SellPrice - previousStock?.SellPrice : undefined;

        if(priceDifference && priceDifference >= smallestPriceDifferenceStock.SellPrice){
            smallestPriceDifferenceStock.SellPrice = priceDifference;
            smallestPriceDifferenceStock.businessId = currentStock.businessId;
            smallestPriceDifferenceStock.totalListedStock = currentStock.totalListedStock;
        }
    });

    const service = new StockService();
    const owned = await service.getMyStocks("1212");
    const selected = owned.find(stock => stock.businessId === smallestPriceDifferenceStock.businessId);
    if(selected) {
        // TODO: sell half the stocks idk?
        const amountToSell = selected.ownedStock/2;
        await service.sellStock(selected.businessId, amountToSell);
    }

}