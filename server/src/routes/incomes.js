import { Router } from 'express';
import * as incomeController from '../controllers/incomeController.js';
import { validateTransaction } from '../middleware/validate.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Все маршруты доходов доступны только авторизованному пользователю
router.use(requireAuth);

router.get('/', incomeController.getAll);
router.get('/:id', incomeController.getById);
router.post(
  '/',
  validateTransaction('income'),
  incomeController.create
);
router.put(
  '/:id',
  validateTransaction('income'),
  incomeController.update
);
router.delete('/:id', incomeController.remove);

export default router;