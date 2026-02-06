import pool from "../config/db.js";

import { hashPassword, comparePassword } from "../utils/password.js";

import generateToken from "../utils/jwt.js";

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
