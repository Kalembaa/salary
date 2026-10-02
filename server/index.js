import app from './src/app.js';
import { config } from './src/config/index.js';

app.listen(config.port, () => {
  console.log(`Salary Tracker API запущен: http://localhost:${config.port}`);
});
