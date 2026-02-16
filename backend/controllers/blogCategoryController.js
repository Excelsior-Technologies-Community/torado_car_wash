import pool from "../config/db.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await pool.query(
      `UPDATE blog_categories SET name = ?, slug = ? WHERE id = ?`,
      [name, slug, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ message: "Category updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [[usage]] = await pool.query(
      `SELECT COUNT(*) AS total FROM blogs WHERE category_id = ?`,
      [id],
    );

    if (usage.total > 0) {
      return res.status(400).json({
        message: "Cannot delete category that is used by blogs",
      });
    }

    const [result] = await pool.query(
      `DELETE FROM blog_categories WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting category" });
  }
};
