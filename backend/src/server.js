import express from 'express';
import cors from 'cors';
import compareRouter from './routes/compare.js';
import { connectToDb } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

async function createServer() {
  const app = express();
  app.use(cors());

  // connect to DB and attach to app
  const db = await connectToDb();
  app.locals.db = db;

  app.use('/api', compareRouter);

  // health
  app.get('/', (_req, res) => res.send('ok'));

  app.use(errorHandler);

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}

createServer().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
