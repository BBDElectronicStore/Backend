import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";
import {ZeusService} from "../services/zeus.service";
import {UpdatePriceCommand} from "../commands/updatePrice.command";
import {ProductRepository} from "./product.repository";

export class OrderRepository implements IRepository {

    public async updateOrderStatus(orderRef: string, status: string) {
        try {
            const orderId = orderRef.split("-")[1] || orderRef;
            await DBPool.query('BEGIN');
            const updateOrderResult = await DBPool.query(`
              UPDATE orders
              SET status_id = (SELECT status_id FROM status WHERE status_name = $1)
              WHERE order_id = $2
            `, [status, orderId]);
            await DBPool.query('COMMIT');
            return updateOrderResult.rowCount;
        }
        catch (e) {
            await DBPool.query('ROLLBACK');
            console.error('Error updating order status:', e);
            throw e;
        }
    }

    async getOrCreateCustomerId(persona_id: string): Promise<number> {

        try {
            const upsertQuery = `
            WITH ins AS (
              INSERT INTO customers (persona_id)
              VALUES ($1)
              ON CONFLICT (persona_id)
              DO NOTHING
              RETURNING customer_id
            )
            SELECT customer_id
            FROM ins
            UNION ALL
            SELECT customer_id
            FROM customers
            WHERE persona_id = $1
            LIMIT 1
          `;

            const result = await DBPool.query(upsertQuery, [persona_id]);

            if (result.rows.length > 0) {
                return result.rows[0].customer_id;
            } else {
                throw new Error('Failed to get or create customer.');
            }
        } catch (error) {
            throw error;
        }
    }


    async placeOrderAndGetTotalCost(quantity: number, customerId: number): Promise<any> {
        try {
            await DBPool.query('BEGIN');

            const fetchProductQuery = `
                SELECT "price", "VAT"
                FROM "products"
                ORDER BY "product_id"
                LIMIT 1
            `;

            const actualId = await this.getOrCreateCustomerId(customerId.toString());

            const productResult = await DBPool.query(fetchProductQuery);

            if (productResult.rows.length === 0) {
                throw new Error("No products found");
            }

            let price = productResult.rows[0].price;
            const VAT = productResult.rows[0].VAT;
            const zeusService = new ZeusService();
            const priceCheck = await zeusService.getPrice();
            if(priceCheck && priceCheck > price) {
                price = priceCheck;
                const command = new UpdatePriceCommand(new ProductRepository());
                await command.execute(price);
            }
            const totalCost = Math.round(price * quantity * (1 + VAT / 100));

            const orderResult = await DBPool.query(`
                INSERT INTO "orders" ("customer_id", "quantity", "status_id", "total_cost")
                VALUES ($1, $2, (SELECT "status_id" FROM "status" WHERE "status_name" = 'pending'), $3)
                RETURNING "order_id"
            `, [actualId, quantity, totalCost]);

            if (orderResult.rows.length === 0) {
                throw new Error('Failed to insert new order.');
            }
            const orderId = orderResult.rows[0].order_id;
            await DBPool.query('COMMIT');
            return { order_id: orderId, total_cost: totalCost };
        } catch (error) {
            await DBPool.query('ROLLBACK');
            console.error('Error placing order:', error);
            return null;
        }
    }

    async getOrdersByPersonaId(personaId: string) {
        try {

            const result = await DBPool.query(`
            SELECT o.order_id, o.quantity, o.total_cost, s.status_name
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN status s ON o.status_id = s.status_id
            WHERE c.persona_id = $1
            ORDER BY o.order_id;
            `, [personaId]);

            return result.rows
        }
        catch(e) {
            console.error('Error getting orders by persona id:', e);
            throw e;
        }
    }
}