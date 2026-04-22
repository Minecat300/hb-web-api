import { getConnection, pool } from "./db.js";
import { randomUUID } from "crypto";

export async function createUser(email, username, passwordHash, roles = []) {
    const accountId = randomUUID();
    const credentialId = randomUUID();

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Create account
        await conn.query(
            `INSERT INTO ACCOUNT (uuid, email, username, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW());`,
            [accountId, email, username]
        );

        // 2. Store password
        await conn.query(
            `INSERT INTO AUTH_CREDENTIAL (uuid, account_uuid, password_hash)
             VALUES (?, ?, ?);`,
            [credentialId, accountId, passwordHash]
        );

        // 3. Resolve role names → UUIDs
        for (const roleName of roles) {
            const [roleRows] = await conn.query(
                `SELECT uuid FROM ROLE WHERE name = ?`,
                [roleName]
            );

            let roleId;

            if (roleRows.length === 0) {
                roleId = randomUUID();

                await conn.query(
                    `INSERT INTO ROLE (uuid, name, description)
                    VALUES (?, ?, ?);`,
                    [roleId, roleName, `${roleName} role`]
                );
            } else {
                roleId = roleRows[0].uuid;
            }

            await conn.query(
                `INSERT INTO ACCOUNT_ROLE (account_uuid, role_uuid, assigned_at)
                 VALUES (?, ?, NOW());`,
                [accountId, roleId]
            );
        }

        await conn.commit();
        return { uuid: accountId };

    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

export async function fetchUser(username) {
    try {
        const [rows] = await pool.query(
            `SELECT 
                a.uuid,
                a.email,
                a.username,
                ac.password_hash,
                r.uuid AS role_uuid,
                r.name AS role_name
             FROM ACCOUNT a
             LEFT JOIN AUTH_CREDENTIAL ac ON ac.account_uuid = a.uuid
             LEFT JOIN ACCOUNT_ROLE ar ON ar.account_uuid = a.uuid
             LEFT JOIN ROLE r ON r.uuid = ar.role_uuid
             WHERE a.username = ?;`,
            [username]
        );

        return rows;
    } catch (error) {
        throw error;
    }
}

export async function deleteUserById(userId) {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        await conn.query(
            `DELETE FROM ACCOUNT_ROLE WHERE account_uuid = ?`,
            [userId]
        );

        await conn.query(
            `DELETE FROM AUTH_CREDENTIAL WHERE account_uuid = ?`,
            [userId]
        );

        await conn.query(
            `DELETE FROM ACCOUNT WHERE uuid = ?`,
            [userId]
        );

        await conn.commit();

    } catch (error) {
        await conn.rollback();
        throw error;

    } finally {
        conn.release();
    }
}

export async function fetchUsers() {
    try {
        const [rows] = await pool.query(
            `SELECT 
                a.uuid,
                a.email,
                a.username,
                r.uuid AS role_uuid,
                r.name AS role_name
             FROM ACCOUNT a
             LEFT JOIN AUTH_CREDENTIAL ac ON ac.account_uuid = a.uuid
             LEFT JOIN ACCOUNT_ROLE ar ON ar.account_uuid = a.uuid
             LEFT JOIN ROLE r ON r.uuid = ar.role_uuid;`
        );

        return rows;
    } catch (error) {
        throw error;
    }
}

export async function deleteUserByUsername(username) {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [rows] = await conn.query(
            `SELECT uuid FROM ACCOUNT WHERE username = ?`,
            [username]
        );

        if (rows.length === 0) {
            throw new Error("User not found");
        }

        const userId = rows[0].uuid;

        await conn.query(
            `DELETE FROM ACCOUNT_ROLE WHERE account_uuid = ?`,
            [userId]
        );

        await conn.query(
            `DELETE FROM AUTH_CREDENTIAL WHERE account_uuid = ?`,
            [userId]
        );

        await conn.query(
            `DELETE FROM ACCOUNT WHERE uuid = ?`,
            [userId]
        );

        await conn.commit();

    } catch (error) {
        await conn.rollback();
        throw error;

    } finally {
        conn.release();
    }
}