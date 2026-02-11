import { Request, Response } from 'express';
import { MetaResponse } from '@petrosquare/types';
import { env } from '../config/env';

export const getMeta = (req: Request, res: Response<MetaResponse>) => {
  res.json({
    version: env.API_VERSION,
    buildId: env.BUILD_ID,
    commit: env.COMMIT_SHA,
    region: env.REGION,
  });
};
