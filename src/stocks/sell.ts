import {Stock} from "../interfaces/stock";
import {StockService} from "../services/stock.service";

export async function sell(oldStock: Stock[], newStock: Stock[]) {
    let biggestPriceDifference = -99999;
    let biggestPriceDifferenceStock: Stock = {
        businessId: "0",
        SellPrice: -9999999,
        totalListedStock: 0
    };


    newStock.forEach((currentStock ) => {
        const previousStock = oldStock.find(prev => prev.businessId === currentStock.businessId);

        // if not our stock then
        const priceDifference = previousStock ? currentStock.SellPrice - previousStock?.SellPrice : undefined;

        if(priceDifference && priceDifference >= biggestPriceDifference){
            biggestPriceDifference = priceDifference;
            biggestPriceDifferenceStock = currentStock;
        }
    });

    const service = new StockService();
    const owned = await service.getMyStocks("1212"); //TODO get our userId from out special table in the DB
    const selected = owned.find(stock => stock.businessId === biggestPriceDifferenceStock.businessId);
    if(selected) {
        // TODO: sell half the stocks idk?
        const amountToSell = selected.ownedStock/2;
        await service.sellStock(selected.businessId, amountToSell);
    }

}