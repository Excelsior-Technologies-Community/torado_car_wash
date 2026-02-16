import pool from "../config/db.js";

export const getAllPages = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM pages ORDER BY updated_at DESC"
    );
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch pages", error: error.message });
  }
};

export const createPage = async (req, res) => {
  try {
    const { slug, title, content } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ success: false, message: "slug and title are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)",
      [slug, title, content || null]
    );

    const [rows] = await pool.query("SELECT * FROM pages WHERE id = ?", [result.insertId]);
    return res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create page", error: error.message });
  }
};

export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, title, content } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid page ID" });
    }

    const updates = [];
    const params = [];
    if (slug !== undefined) {
      updates.push("slug = ?");
      params.push(slug);
    }
    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      params.push(content);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    params.push(id);
    const [result] = await pool.query(`UPDATE pages SET ${updates.join(", ")} WHERE id = ?`, params);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    return res.json({ success: true, message: "Page updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update page", error: error.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid page ID" });
    }

    const [result] = await pool.query("DELETE FROM pages WHERE id = ?", [id]);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    return res.json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete page", error: error.message });
  }
};

export const getSiteSettings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM site_settings ORDER BY id DESC LIMIT 1");
    return res.json({ success: true, data: rows[0] || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch site settings", error: error.message });
  }
};

export const upsertSiteSettings = async (req, res) => {
  try {
    const { address, phone, email, social_links } = req.body;
    const normalizedSocialLinks =
      social_links === undefined || social_links === null || social_links === ""
        ? null
        : typeof social_links === "string"
          ? social_links
          : JSON.stringify(social_links);

    const [existing] = await pool.query("SELECT id FROM site_settings ORDER BY id DESC LIMIT 1");

    if (existing.length === 0) {
      const [result] = await pool.query(
        "INSERT INTO site_settings (address, phone, email, social_links) VALUES (?, ?, ?, ?)",
        [address || null, phone || null, email || null, normalizedSocialLinks]
      );
      const [rows] = await pool.query("SELECT * FROM site_settings WHERE id = ?", [result.insertId]);
      return res.status(201).json({ success: true, data: rows[0], message: "Site settings created successfully" });
    }

    const id = existing[0].id;
    await pool.query(
      "UPDATE site_settings SET address = ?, phone = ?, email = ?, social_links = ? WHERE id = ?",
      [address || null, phone || null, email || null, normalizedSocialLinks, id]
    );
    const [rows] = await pool.query("SELECT * FROM site_settings WHERE id = ?", [id]);
    return res.json({ success: true, data: rows[0], message: "Site settings updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to save site settings", error: error.message });
  }
};
