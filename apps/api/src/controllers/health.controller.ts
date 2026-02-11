import { Request, Response } from 'express';
import { HealthResponse } from '@petrosquare/types';
import { env } from '../config/env';

export const getHealth = (req: Request, res: Response<HealthResponse>) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
};
