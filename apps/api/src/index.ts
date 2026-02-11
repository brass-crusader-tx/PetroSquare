import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Asset } from '@petrosquare/types';

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/assets', (req, res) => {
  // Mock data for initial setup
  const assets: Asset[] = [
    {
      id: 'well-001',
      name: 'Alpha-1',
      type: 'WELL',
      status: 'ACTIVE',
      latitude: 31.9686,
      longitude: -99.9018,
      metadata: { field: 'Permian' }
    },
    {
      id: 'pump-102',
      name: 'Pump Station A',
      type: 'PUMP',
      status: 'MAINTENANCE',
      latitude: 31.9690,
      longitude: -99.9020
    }
  ];
  res.json(assets);
});

app.listen(port, () => {
  console.log(`API Server running on port ${port}`);
});
