import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Fallback for 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;
