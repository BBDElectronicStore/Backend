import {Stock} from "../interfaces/stock";

export async function sell(oldStock: Stock[], newStock: Stock[]) {
    oldStock.forEach((oldStockItem) => {
        newStock.forEach((newStockItem) => {
            if(oldStockItem.businessId === newStockItem.businessId) {
                // if(oldStock)
                // if(oldStockItem.totalListedStock > newStockItem.totalListedStock) {
                //     console.log(`Selling ${oldStockItem.totalListedStock - newStockItem.totalListedStock} stocks of businessId ${oldStockItem.businessId} at ${oldStockItem.SellPrice}`);
                // }
            }
        })
    })
}