import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { validateTransaction } from '../middleware/validate.js';

const router = Router();
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.post('/', validateTransaction('expense'), expenseController.create);
router.put('/:id', validateTransaction('expense'), expenseController.update);
router.delete('/:id', expenseController.remove);
export default router;
