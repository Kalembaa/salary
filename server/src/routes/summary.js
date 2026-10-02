import { Router } from 'express';
import * as summaryController from '../controllers/summaryController.js';

const router = Router();
router.get('/', summaryController.getBalance);
router.get('/category', summaryController.getByCategory);
router.get('/month', summaryController.getByMonth);
export default router;
