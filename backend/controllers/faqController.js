import pool from "../config/db.js";

export const createFaq = async (req, res) => {
  try {
    const { category_id, question, answer, display_order } = req.body;

    if (!category_id || !question || !answer) {
      return res.status(400).json({ message: "Category ID, question, and answer are required" });
    }

    // Check if category exists
    const [categories] = await pool.query(
      "SELECT id FROM faq_categories WHERE id = ? AND is_active = TRUE",
      [category_id]
    );

    if (categories.length === 0) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const [result] = await pool.query(
      "INSERT INTO faqs (category_id, question, answer, display_order) VALUES (?, ?, ?, ?)",
      [category_id, question, answer, display_order || 0]
    );

    res.status(201).json({
      id: result.insertId,
      category_id,
      question,
      answer,
      display_order: display_order || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create FAQ" });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const [faqs] = await pool.query(
      `SELECT f.*, fc.name as category_name 
       FROM faqs f 
       JOIN faq_categories fc ON f.category_id = fc.id 
       WHERE f.is_active = TRUE AND fc.is_active = TRUE 
       ORDER BY f.display_order ASC, f.created_at DESC`
    );
    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

export const getFaqsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [faqs] = await pool.query(
      `SELECT f.*, fc.name as category_name 
       FROM faqs f 
       JOIN faq_categories fc ON f.category_id = fc.id 
       WHERE f.category_id = ? AND f.is_active = TRUE AND fc.is_active = TRUE 
       ORDER BY f.display_order ASC, f.created_at DESC`,
      [categoryId]
    );
    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch FAQs by category" });
  }
};

export const getSingleFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const [faqs] = await pool.query(
      `SELECT f.*, fc.name as category_name 
       FROM faqs f 
       JOIN faq_categories fc ON f.category_id = fc.id 
       WHERE f.id = ? AND f.is_active = TRUE AND fc.is_active = TRUE`,
      [id]
    );

    if (faqs.length === 0) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json(faqs[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch FAQ" });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, question, answer, display_order } = req.body;

    const updates = [];
    const params = [];

    if (category_id !== undefined) {
      // Check if category exists
      const [categories] = await pool.query(
        "SELECT id FROM faq_categories WHERE id = ? AND is_active = TRUE",
        [category_id]
      );
      if (categories.length === 0) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      updates.push("category_id = ?");
      params.push(category_id);
    }
    if (question !== undefined) {
      updates.push("question = ?");
      params.push(question);
    }
    if (answer !== undefined) {
      updates.push("answer = ?");
      params.push(answer);
    }
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      params.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE faqs SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update FAQ" });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE faqs SET is_active = FALSE WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
};