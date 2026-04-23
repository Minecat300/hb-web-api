import mysql from 'mysql2/promise';

const host = '172.17.0.3';
const user = 'user';
const database = 'db';

export async function getConnection() {
    const DB_PASSWORD = process.env.DB_PASSWORD;

    try {
        return await mysql.createConnection({
            host,
            user,
            database,
            password: DB_PASSWORD
        });
    } catch (error) {
        throw error;
    }
}

export async function getPool() {

    let pool;

    try {
        const DB_PASSWORD = process.env.DB_PASSWORD;

        pool = await mysql.createPool({
            host,
            user,
            database,
            password: DB_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    } catch (error) {
        console.log(error);
    }

    return pool;
}