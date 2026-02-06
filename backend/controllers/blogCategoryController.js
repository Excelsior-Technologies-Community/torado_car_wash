import pool from "../config/db.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    await pool.query(`INSERT INTO blog_categories (name) VALUES (?)`, [name]);

    res.status(201).json({ message: "Category created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating category" });
  }
};

export const getCategories = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM blog_categories");
  res.json(rows);
};
