import Contact from '../models/contact.model.js';

/**
 * @desc    Submit a contact form message
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message.',
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Private/Admin
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update contact read status
 * @route   PUT /api/contact/:id
 * @access  Private/Admin
 */
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }

    contact.isRead = !contact.isRead;
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact,
      message: `Message marked as ${contact.isRead ? 'read' : 'unread'}`,
    });
  } catch (error) {
    next(error);
  }
};
