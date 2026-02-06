import pool from "../config/db.js";

export const createFaqCategory = async (req, res) => {
  try {
    const { name, slug, description, display_order } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO faq_categories (name, slug, description, display_order) VALUES (?, ?, ?, ?)",
      [name, slug, description, display_order || 0]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      description,
      display_order: display_order || 0
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(500).json({ message: "Failed to create FAQ category" });
  }
};

export const getAllFaqCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM faq_categories WHERE is_active = TRUE ORDER BY display_order ASC, created_at DESC"
    );
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch FAQ categories" });
  }
};

export const getSingleFaqCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.query(
      "SELECT * FROM faq_categories WHERE id = ? AND is_active = TRUE",
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "FAQ category not found" });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch FAQ category" });
  }
};

export const updateFaqCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, display_order } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (slug !== undefined) {
      updates.push("slug = ?");
      params.push(slug);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      params.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE faq_categories SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FAQ category not found" });
    }

    res.json({ message: "FAQ category updated successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(500).json({ message: "Failed to update FAQ category" });
  }
};

export const deleteFaqCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE faq_categories SET is_active = FALSE WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FAQ category not found" });
    }

    res.json({ message: "FAQ category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete FAQ category" });
  }
};