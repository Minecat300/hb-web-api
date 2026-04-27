import { NoticeModel, TokenModel } from "../data/noticeDB.js";
import { randomUUID } from "crypto";

export const NoticeController = {
    async createNotice(req, res) {
        try {
            const { title, description, category, status } = req.body;

            const uuid = randomUUID();

            await NoticeModel.create({
                uuid,
                title,
                description,
                category,
                status
            });

            res.status(201).json({ uuid });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAllNotices(req, res) {
        try {
            const notices = await NoticeModel.getAll();
            res.status(200).json(notices);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getNoticeById(req, res) {
        try {
            const notice = await NoticeModel.getById(req.params.id);

            if (!notice) {
                return res.status(404).json({ error: "Not found" });
            }

            res.status(200).json(notice);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { status } = req.body;

            await NoticeModel.updateStatus(req.params.id, status);

            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getByMonthAndCategory(req, res) {
        try {
            const { category, year, month } = req.query;

            if (!category || !year || !month) {
                return res.status(400).json({
                    error: "category, year, and month are required"
                });
            }

            const notices = await NoticeModel.getNoticesByMonthAndCategory(
                category,
                parseInt(year),
                parseInt(month)
            );

            res.status(200).json(notices);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async countByMonthAndCategory(req, res) {
        try {
            const { category, year, month } = req.query;

            if (!category || !year || !month) {
                return res.status(400).json({
                    error: "category, year, and month are required"
                });
            }

            const total = await NoticeModel.countNoticesByMonthAndCategory(
                category,
                parseInt(year),
                parseInt(month)
            );

            res.status(200).json({ total });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export const TokenController = {
    async createToken(req, res) {
        try {
            const { notice_uuid, token_hash } = req.body;

            const uuid = randomUUID();

            await TokenModel.create({
                uuid,
                notice_uuid,
                token_hash
            });

            res.status(201).json({ uuid });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};