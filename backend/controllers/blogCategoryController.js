import pool from "../config/db.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await pool.query(`INSERT INTO blog_categories (name, slug) VALUES (?, ?)`, [name, slug]);

    res.status(201).json({ message: "Category created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating category" });
  }
};

export const getCategories = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT bc.*, COUNT(b.id) as count 
     FROM blog_categories bc
     LEFT JOIN blogs b ON bc.id = b.category_id AND b.is_published = 1
     GROUP BY bc.id`
  );
  res.json(rows);
};
