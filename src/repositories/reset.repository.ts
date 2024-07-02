import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";

export class ResetRepository implements IRepository {

    public async resetDatabase() {
        try {
            await DBPool.query('BEGIN');
            const resetResult = await DBPool.query(`
              DELETE FROM "customers";
              DELETE FROM "orders";
              DELETE FROM "special";
            `);
            await DBPool.query('COMMIT');
        }
        catch (e) {
            await DBPool.query('ROLLBACK');
            console.error('Error deleting from DB:', e);
            throw e;
        }
    }

}