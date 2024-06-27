import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";


export class ProductRepository implements IRepository {

    async updateProductPriceAndVAT(newPrice: number, newVAT: number) {
        try {
            const result = await DBPool.query(`
              UPDATE "products"
              SET "price" = $1,
                  "VAT" = $2
              WHERE "product_id" = (
                SELECT "product_id"
                FROM "products"
                ORDER BY "product_id"
                LIMIT 1
              )
            `, [newPrice, newVAT]);

            return result.rowCount;
        } catch (error) {
            return -1;
        }
    }
}