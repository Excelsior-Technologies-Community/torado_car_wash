import pool from "../config/db.js";
import jwt from "jsonwebtoken";

import { hashPassword, comparePassword } from "../utils/password.js";

import generateToken from "../utils/jwt.js";
import { sendPasswordResetEmail } from "../config/mail.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    const [existing] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "User Already Exist with this Email" });
    }

    const hashed = await hashPassword(password);

    const [roles] = await pool.query(
      `SELECT id FROM roles WHERE name = 'user'`,
    );
    
    if (roles.length === 0) {
      return res.status(500).json({ message: "User role not found. Please contact administrator." });
    }
    
    const roleId = roles[0].id;

    await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role_id) VALUES (?,?,?,?,?)`,
      [name, email, phone, hashed, roleId],
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      `SELECT u.*, r.name as role_name FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? AND u.is_active = TRUE`,
      [email],
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const user = users[0];
    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken({ id: user.id, role: user.role_name });

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role_name,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [users] = await pool.query(
      `SELECT id, name, email FROM users WHERE email = ? AND is_active = TRUE`,
      [email],
    );

    if (users.length === 0) {
      return res.status(200).json({
        message: "If this email exists, a password reset link has been sent.",
      });
    }

    const user = users[0];
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetLink,
    });

    return res.status(200).json({
      message: "If this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    if (decoded.type !== "password_reset" || !decoded.id) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashed = await hashPassword(password);

    const [result] = await pool.query(
      `UPDATE users SET password_hash = ? WHERE id = ? AND email = ? AND is_active = TRUE`,
      [hashed, decoded.id, decoded.email],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
