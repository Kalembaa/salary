import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';
import authRouter from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors(config.cors));
app.use(express.json());

// Регистрация и авторизация
app.use('/api/v1/auth', authRouter);

// Финансовые данные
app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/summary', summaryRouter);

// Обработка неизвестных маршрутов
app.use((req, res, next) => {
  const error = new Error('Маршрут не найден');
  error.statusCode = 404;
  error.code = 'ROUTE_NOT_FOUND';
  next(error);
});

app.use(errorHandler);

export default app;