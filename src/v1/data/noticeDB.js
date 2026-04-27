import { getConnection, getPool } from './db.js';

export const NoticeModel = {

    async create({ uuid, title, description, category, status }) {
        const db = await getConnection();
        const [result] = await db.execute(
            `INSERT INTO NOTICE_OF_DEVIATION 
            (uuid, title, description, category, status, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [uuid, title, description, category, status]
        );
        return result;
    },

    async getAll() {
        const db = await getConnection();
        const [rows] = await db.execute(`SELECT * FROM NOTICE_OF_DEVIATION`);
        return rows;
    },

    async getById(uuid) {
        const db = await getConnection();
        const [rows] = await db.execute(
            `SELECT * FROM NOTICE_OF_DEVIATION WHERE uuid = ?`,
            [uuid]
        );
        return rows[0];
    },

    async updateStatus(uuid, status) {
        const db = await getConnection();
        await db.execute(
            `UPDATE NOTICE_OF_DEVIATION SET status = ? WHERE uuid = ?`,
            [status, uuid]
        );

        await db.execute(
            `INSERT INTO NOTICE_STATUS_HISTORY (uuid, notice_uuid, status)
             VALUES (UUID(), ?, ?)`,
            [uuid, status]
        );
    },

    async getNoticesByMonthAndCategory(category, year, month) {
        const pool = await getPool();

        const [rows] = await pool.query(
            `SELECT *
            FROM NOTICE_OF_DEVIATION
            WHERE category = ?
            AND YEAR(created_at) = ?
            AND MONTH(created_at) = ?
            ORDER BY created_at DESC`,
            [category, year, month]
        );

        return rows;
    },

    async countNoticesByMonthAndCategory(category, year, month) {
        const pool = await getPool();

        const [rows] = await pool.query(
            `SELECT COUNT(*) AS total
            FROM NOTICE_OF_DEVIATION
            WHERE category = ?
            AND YEAR(created_at) = ?
            AND MONTH(created_at) = ?`,
            [category, year, month]
        );

        return rows[0]?.total || 0;
    },
    async delete(uuid) {
        const db = await getConnection();

        await db.execute(
            `DELETE FROM NOTICE_STATUS_HISTORY WHERE notice_uuid = ?`,
            [uuid]
        );

        await db.execute(
            `DELETE FROM NOTICE_OF_DEVIATION WHERE uuid = ?`,
            [uuid]
        );
    }
};

export const TokenModel = {
    async create({ uuid, notice_uuid, token_hash }) {
        const db = await getConnection();
        const [result] = await db.execute(
            `INSERT INTO REPORT_ACCESS_TOKEN 
            (uuid, notice_uuid, token_hash)
            VALUES (?, ?, ?)`,
            [uuid, notice_uuid, token_hash]
        );
        return result;
    },

    async getByToken(token_hash) {
        const db = await getConnection();
        const [rows] = await db.execute(
            `SELECT * FROM REPORT_ACCESS_TOKEN WHERE token_hash = ?`,
            [token_hash]
        );
        return rows[0];
    }
};