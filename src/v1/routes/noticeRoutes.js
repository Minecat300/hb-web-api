import express from "express";

import { NoticeController, TokenController } from "../controllers/noticeController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

//GET | localhost:3868/api/v1/notices
router.get('/', authenticateToken, authorizeRole('admin', 'management'), NoticeController.getAllNotices);

//GET | localhost:3868/api/v1/notices/:id
router.get('/:id', authenticateToken, authorizeRole('admin', 'management'), NoticeController.getNoticeById);

//POST | localhost:3868/api/v1/notices
router.post('/', authenticateToken, NoticeController.createNotice);

//POST | localhost:3868/api/v1/notices/token
router.post('/token', authenticateToken, TokenController.createToken);

//PUT | localhost:3868/api/v1/notices/:id/status
router.put('/:id/status', authenticateToken, authorizeRole('admin', 'management'), NoticeController.updateStatus);

//GET | localhost:3868/api/v1/notices/filter
router.get("/notices/filter", authenticateToken, authorizeRole('admin', 'management'), NoticeController.getByMonthAndCategory);

//GET | localhost:3868/api/v1/notices/count
router.get("/notices/count", authenticateToken, authorizeRole('admin', 'management'), NoticeController.countByMonthAndCategory);

export default router;