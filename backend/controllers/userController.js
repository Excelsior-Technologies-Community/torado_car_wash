import pool from "../config/db.js";
import { hashPassword } from "../utils/password.js";

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role_id, r.name AS role_name, u.is_active, u.created_at, u.updated_at
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`,
    );

    return res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getRoles = async (req, res) => {
  try {
    const [roles] = await pool.query(
      `SELECT id, name FROM roles ORDER BY name ASC`,
    );
    return res.status(200).json({ data: roles });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch roles" });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role_id, is_active } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: "Name, email, password and role are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const [existing] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const [roles] = await pool.query(`SELECT id FROM roles WHERE id = ?`, [role_id]);
    if (roles.length === 0) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const hashedPassword = await hashPassword(password);
    const activeFlag = is_active === undefined ? true : Boolean(is_active);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role_id, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, hashedPassword, role_id, activeFlag],
    );

    return res.status(201).json({
      message: "User created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, role_id, is_active } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }

    if (email !== undefined) {
      const [existingEmail] = await pool.query(
        `SELECT id FROM users WHERE email = ? AND id <> ?`,
        [email, id],
      );
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: "Another user already uses this email" });
      }
      updates.push("email = ?");
      params.push(email);
    }

    if (phone !== undefined) {
      updates.push("phone = ?");
      params.push(phone || null);
    }

    if (role_id !== undefined) {
      const [roles] = await pool.query(`SELECT id FROM roles WHERE id = ?`, [role_id]);
      if (roles.length === 0) {
        return res.status(400).json({ message: "Invalid role selected" });
      }
      updates.push("role_id = ?");
      params.push(role_id);
    }

    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(Boolean(is_active));
    }

    if (password !== undefined && password !== null && String(password).trim() !== "") {
      if (String(password).length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const hashedPassword = await hashPassword(password);
      updates.push("password_hash = ?");
      params.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    params.push(id);
    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      params,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const deactivateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === Number(req.user.id)) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    const [result] = await pool.query(
      `UPDATE users SET is_active = FALSE WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to deactivate user" });
  }
};
