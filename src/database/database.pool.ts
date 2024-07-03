import { Pool } from 'pg';

export const DBPool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT) || 5432,
    database: process.env.DBNAME,
    ssl: {
        rejectUnauthorized: false
    }
})