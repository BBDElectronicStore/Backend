import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";
import {QueryResult} from "pg";


export class SpecialRepository implements IRepository {
    public async insertSpecialValue(key: string, value: string) {
        try {
            await DBPool.query('BEGIN');
            const res = await DBPool.query(`
                INSERT INTO "special" (key, value)
                VALUES ($1, $2)
                `, [key, value]);
            await DBPool.query('COMMIT');
            return true;
        }
        catch (e) {
            await DBPool.query('ROLLBACK');
            console.error('Error adding special value:', e);
            throw e;
        }
    }

    public async getSpecialValue(key: string) {
        try {
            const res = await DBPool.query(`
              SELECT value
              FROM "special" s
              WHERE
                s.key = $1;
              `, [key]);
            return String(res.rows[0]);
          } catch (e) {
            console.log('Error getting special value: ',e);
            throw e;
          }
    }
}