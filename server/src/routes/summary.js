import { Router } from 'express';
import * as summaryController from '../controllers/summaryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Вся финансовая сводка доступна только авторизованному пользователю
router.use(requireAuth);

router.get('/', summaryController.getBalance);
router.get('/category', summaryController.getByCategory);
router.get('/month', summaryController.getByMonth);

export default router;