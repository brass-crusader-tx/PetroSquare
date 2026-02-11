import { Router } from 'express';
import { getCapabilities } from '../controllers/capabilities.controller';

const router: Router = Router();

router.get('/', getCapabilities);

export default router;
