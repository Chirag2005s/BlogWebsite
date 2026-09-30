import express from 'express';
import { getAdvertisement, updateAdvertisement } from '../controllers/advertisementController.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAdvertisement)
  .put(protect, admin, updateAdvertisement);

export default router;
