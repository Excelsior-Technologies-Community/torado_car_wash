import db from '../config/db.js';
import { sendContactEmail } from '../config/mail.js';

// Create contact submission
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Store in database
    const [result] = await db.execute(
      'INSERT INTO contact_submissions (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, subject, message]
    );

    // Send email
    await sendContactEmail({ name, email, phone, subject, message });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
};

// Get all contacts (admin)
export const getAllContacts = async (req, res) => {
  try {
    const [contacts] = await db.execute(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
};

// Get single contact
export const getContact = async (req, res) => {
  try {
    const [contact] = await db.execute(
      'SELECT * FROM contact_submissions WHERE id = ?',
      [req.params.id]
    );

    if (contact.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: error.message
    });
  }
};

// Mark as read
export const markAsRead = async (req, res) => {
  try {
    await db.execute(
      'UPDATE contact_submissions SET is_read = TRUE WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Contact marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: error.message
    });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM contact_submissions WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message
    });
  }
};