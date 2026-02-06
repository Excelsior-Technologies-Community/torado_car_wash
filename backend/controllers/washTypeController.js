import pool from "../config/db.js";

export const createWashType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO wash_types (name, description, is_active) VALUES (?, ?, TRUE)",
      [name, description || null]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      is_active: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create wash type" });
  }
};

export const getAllWashTypes = async (req, res) => {
  try {
    const [washTypes] = await pool.query(
      "SELECT * FROM wash_types WHERE is_active = TRUE"
    );
    res.json(washTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wash types" });
  }
};