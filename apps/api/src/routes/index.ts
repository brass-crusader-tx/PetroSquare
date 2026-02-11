import { Router } from 'express';
import healthRoutes from './health.routes';
import metaRoutes from './meta.routes';
import capabilitiesRoutes from './capabilities.routes';

const router: Router = Router();

router.use('/health', healthRoutes);
router.use('/meta', metaRoutes);
router.use('/capabilities', capabilitiesRoutes);

export default router;
