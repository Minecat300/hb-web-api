import express from "express";

import { NoticeController, TokenController } from "../controllers/noticeController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

//POST | localhost:3868/api/v1/notices/token
router.post('/token', authenticateToken, TokenController.createToken);

//GET | localhost:3868/api/v1/notices/filter
router.get("/filter", authenticateToken, authorizeRole('admin', 'management'), NoticeController.getByMonthAndCategory);

//GET | localhost:3868/api/v1/notices/count
router.get("/count", authenticateToken, authorizeRole('admin', 'management'), NoticeController.countByMonthAndCategory);

//GET | localhost:3868/api/v1/notices
router.get('/', authenticateToken, authorizeRole('admin', 'management'), NoticeController.getAllNotices);

//POST | localhost:3868/api/v1/notices
router.post('/', authenticateToken, NoticeController.createNotice);

//GET | localhost:3868/api/v1/notices/:id
router.get('/:id', authenticateToken, authorizeRole('admin', 'management'), NoticeController.getNoticeById);

//PUT | localhost:3868/api/v1/notices/:id/status
router.put('/:id/status', authenticateToken, authorizeRole('admin', 'management'), NoticeController.updateStatus);

export default router;