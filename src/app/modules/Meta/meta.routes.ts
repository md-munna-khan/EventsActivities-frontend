import express from 'express';
import { MetaController } from './meta.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Admin and Host dashboard meta
router.get('/', auth(UserRole.ADMIN), MetaController.fetchDashboardMetaData);
router.get('/home-meta', MetaController.fetchHomeMetaData);

export const MetaRoutes = router;