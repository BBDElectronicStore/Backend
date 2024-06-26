import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";


export class CustomerRepository implements IRepository {
    public async doesCustomerExist(uniquePersonaId: string) {
      try {
        const res = await DBPool.query(`
          SELECT 1
          FROM "customers" c
          WHERE
            c.customer_id = $1;
          `, [uniquePersonaId]);
        return res.rows.length === 0;
      } catch (e) {
        console.log('Error checking db for customer: ',e);
        throw e;
      }
    }

    public async addCustomer(uniquePersonaId: string, personaBankingDetails: string) {
      try {
        await DBPool.query('BEGIN');
        const createCustomer = await DBPool.query(`
          INSERT INTO "customers" (persona_id, banking_details)
          VALUES ($1, $2)
        `, [uniquePersonaId, personaBankingDetails]);
        await DBPool.query('COMMIT');
        return true;
    }
    catch (e) {
        await DBPool.query('ROLLBACK');
        console.error('Error updating order status:', e);
        throw e;
    }
  
  }
}