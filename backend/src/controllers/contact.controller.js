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
