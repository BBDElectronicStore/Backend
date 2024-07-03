import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";
import {ZeusService} from "../services/zeus.service";
import {UpdatePriceCommand} from "../commands/updatePrice.command";
import {ProductRepository} from "./product.repository";
import {QueryResult} from "pg";
import {Order} from "../interfaces/order";
import {AllOrders} from "../interfaces/allOrders";

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


    async placeOrderAndGetTotalCost(quantity: number, customerId: number, time: string): Promise<any> {
        try {
            await DBPool.query('BEGIN');

            const fetchProductQuery = `
                SELECT "price", "VAT"
                FROM "products"
                ORDER BY "product_id"
                LIMIT 1
            `;
            console.log("gettingOrCreatingCustomerId");
            const actualId = await this.getOrCreateCustomerId(customerId.toString());
            console.log("DONE gettingOrCreatingCustomerId");
            console.log({actualId});

            const productResult = await DBPool.query(fetchProductQuery);
            console.log({productResult});

            if (productResult.rows.length === 0) {
                throw new Error("No products found");
            }

            let price = productResult.rows[0].price;
            const VAT = productResult.rows[0].VAT;
            console.log({price}, typeof price);
            console.log({VAT}, typeof VAT);
            const zeusService = new ZeusService();
            const priceCheck = await zeusService.getPrice();
            console.log({priceCheck}, typeof priceCheck);
            if(priceCheck && priceCheck !== price) {
                price = priceCheck;
                const command = new UpdatePriceCommand(new ProductRepository());
                await command.execute(priceCheck, 15);
            }
            const totalCost = Math.round(price * quantity * (1 + VAT / 100));
            console.log({totalCost}, typeof totalCost);

            console.log({time}, typeof time);
            console.log({quantity}, typeof quantity);

            const orderResult = await DBPool.query(`
                INSERT INTO "orders" ("customer_id", "quantity", "status_id", "total_cost", "purchase_time")
                VALUES ($1, $2, (SELECT "status_id" FROM "status" WHERE "status_name" = 'pending'), $3, $4)
                RETURNING "order_id"
            `, [actualId, quantity, totalCost, time]);
            
            console.log("Finished getting order result");
            console.log({orderResult}, typeof orderResult);

            if (orderResult.rows.length === 0) {
                throw new Error('Failed to insert new order.');
            }
            console.log("Extracting orderId");
            const orderId = orderResult.rows[0].order_id;
            console.log({orderId}, typeof orderId);
            await DBPool.query('COMMIT');
            return { order_id: orderId, total_cost: totalCost };
        } catch (error) {
            await DBPool.query('ROLLBACK');
            console.error('Error placing order:', error);
            return error as any;
        }
    }

    async getOrdersByPersonaId(personaId: string) {
        try {

            const result: QueryResult<Order> = await DBPool.query(`
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

    async getAllOrders() {
        try {
            const result: QueryResult<AllOrders> = await DBPool.query(`
                SELECT
                    o.order_id,
                    c.persona_id,
                    o.quantity,
                    o.total_cost,
                    s.status_name
                FROM
                    orders o
                        JOIN
                    customers c ON o.customer_id = c.customer_id
                        JOIN
                    status s ON o.status_id = s.status_id
                ORDER BY
                    o.order_id;
            `);

            return result.rows
        }
        catch(e) {
            console.error('Error getting orders:', e);
            throw e;
        }
    }
}