import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";
import {QueryResult} from "pg";
import {Price} from "../interfaces/price";


export class ProductRepository implements IRepository {

    async updateProductPriceAndVAT(newPrice: number, newVat: number) {
        try {
            const result = await DBPool.query(`
              UPDATE "products"
              SET "price" = $1, "VAT" = $2
              WHERE "product_id" = (
                SELECT "product_id"
                FROM "products"
                ORDER BY "product_id"
                LIMIT 1
              )
            `, [newPrice, newVat]);

            return result.rowCount;
        } catch (error) {
            return -1;
        }
    }

    async getProductPriceAndVAT(): Promise<Price | null> {
        try {
            const result: QueryResult<Price> = await DBPool.query(`
              SELECT "price", "VAT"
              FROM "products"
              ORDER BY "product_id"
              LIMIT 1
            `);

            return result.rows[0];
        } catch (error) {
            return null;
        }
    }
}