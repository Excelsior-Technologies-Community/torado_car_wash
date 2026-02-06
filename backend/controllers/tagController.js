import pool from "../config/db.js";

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await pool.query(
      "INSERT INTO tags (name, slug) VALUES (?, ?)",
      [name, slug]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      message: "Tag created"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating tag" });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const [tags] = await pool.query("SELECT * FROM tags");
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tags" });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const [tags] = await pool.query("SELECT * FROM tags WHERE id = ?", [id]);
    
    if (tags.length === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }
    
    res.json(tags[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tag" });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const [result] = await pool.query(
      "UPDATE tags SET name = ?, slug = ? WHERE id = ?",
      [name, slug, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }
    
    res.json({ message: "Tag updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating tag" });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related blog_tags first
    await pool.query("DELETE FROM blog_tags WHERE tag_id = ?", [id]);
    
    const [result] = await pool.query("DELETE FROM tags WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }
    
    res.json({ message: "Tag deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting tag" });
  }
};