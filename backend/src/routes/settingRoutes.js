import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: req.params.key });
    res.json({ success: true, data: setting ? setting.value : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update or create setting (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { key, value } = req.body;
    let setting = await SiteSetting.findOne({ key });
    
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await SiteSetting.create({ key, value });
    }
    
    res.json({ success: true, data: setting.value });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
