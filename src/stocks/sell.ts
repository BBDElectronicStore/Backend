import {Stock} from "../interfaces/stock";
import {StockService} from "../services/stock.service";

export async function sell(oldStock: Stock[], newStock: Stock[]) {
    oldStock.forEach((oldStockItem) => {
        newStock.forEach(async (newStockItem) => {
            if(oldStockItem.businessId === newStockItem.businessId) {
                if(oldStockItem.SellPrice < newStockItem.SellPrice) {
                    console.log(`Buying ${newStockItem.totalListedStock - oldStockItem.totalListedStock} stocks of businessId ${oldStockItem.businessId} at ${oldStockItem.SellPrice}`);
                    const service = await new StockService().sellStock();
                }
            }
        })
    })
}