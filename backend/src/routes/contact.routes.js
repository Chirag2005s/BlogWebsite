import express from 'express';
import { submitContact, getAllContacts, updateContactStatus } from '../controllers/contact.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, admin, getAllContacts);
router.put('/:id', protect, admin, updateContactStatus);

export default router;
