import pool from "../config/db.js";
import { hashPassword } from "../utils/password.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await pool.query(
      `SELECT id, name, email, phone, profile_image FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(users[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, password } = req.body;
    const profile_image = req.file ? req.file.filename : null;

    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (password) {
      const hashed = await hashPassword(password);
      updates.push("password_hash = ?");
      values.push(hashed);
    }
    if (profile_image) {
      updates.push("profile_image = ?");
      values.push(profile_image);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(userId);
    await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
