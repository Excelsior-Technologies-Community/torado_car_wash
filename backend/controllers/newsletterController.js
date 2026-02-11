import db from '../config/db.js';
import crypto from 'crypto';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    await db.execute(
      'INSERT INTO newsletter_subscribers (email, unsubscribe_token) VALUES (?, ?)',
      [email, unsubscribeToken]
    );

    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }
    res.status(500).json({ success: false, message: 'Failed to subscribe', error: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { token } = req.params;

    const [result] = await db.execute(
      'UPDATE newsletter_subscribers SET is_active = FALSE WHERE unsubscribe_token = ?',
      [token]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Invalid token' });
    }

    res.json({ success: true, message: 'Successfully unsubscribed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unsubscribe', error: error.message });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const [subscribers] = await db.execute(
      'SELECT id, email, subscribed_at, is_active FROM newsletter_subscribers ORDER BY subscribed_at DESC'
    );

    res.json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers', error: error.message });
  }
};
