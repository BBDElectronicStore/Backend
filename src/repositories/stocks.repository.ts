import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";
import {Stock} from "../interfaces/stock";
import {QueryResult} from "pg";


export class StocksRepository implements IRepository {
    async updateStocks(stocks: Stock[]): Promise<any> {
        const stockData = JSON.stringify(stocks);
        try {
            await DBPool.query('BEGIN');
            const updateStocksResult = await DBPool.query(`
              UPDATE stocks
              SET stock_data = $1
              WHERE stock_id = 1
            `, [stockData]);
            await DBPool.query('COMMIT');
            return updateStocksResult.rowCount;
        } catch (e) {
            await DBPool.query('ROLLBACK');
            console.error('Error updating stocks:', e);
            throw e;
        }
    }

    async getStocks(): Promise<Stock[]> {
        try {
            const result= await DBPool.query(`
              SELECT stock_data
              FROM stocks
              WHERE stock_id = 1
            `);
            const data =  result.rows[0].stock_data;
            return data;
        } catch (error) {
            return [];
        }
    }
}