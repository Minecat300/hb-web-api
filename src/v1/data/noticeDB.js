import { getConnection } from './db.js';

export const NoticeModel = {
    async create({ uuid, title, description, topic, status }) {
        const db = await getConnection();
        const [result] = await db.execute(
            `INSERT INTO NOTICE_OF_DEVIATION 
            (uuid, title, description, topic, status)
            VALUES (?, ?, ?, ?, ?)`,
            [uuid, title, description, topic, status]
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