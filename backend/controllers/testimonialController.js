import pool from "../config/db.js";

export const createTestimonial = async (req, res) => {
  try {
    const { name, position, rating, message } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !rating) {
      return res.status(400).json({ message: "Name and rating are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO testimonials (name, position, rating, message, image) VALUES (?, ?, ?, ?, ?)",
      [name, position, rating, message, image]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      position,
      rating,
      message,
      image,
      is_approved: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create testimonial" });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const [testimonials] = await pool.query(
      "SELECT * FROM testimonials ORDER BY created_at DESC"
    );
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

export const getApprovedTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const [testimonials] = await pool.query(
      "SELECT * FROM testimonials WHERE is_approved = TRUE ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM testimonials WHERE is_approved = TRUE"
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      testimonials,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch approved testimonials" });
  }
};

export const getSingleTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const [testimonials] = await pool.query(
      "SELECT * FROM testimonials WHERE id = ?",
      [id]
    );

    if (testimonials.length === 0) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(testimonials[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch testimonial" });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, rating, message, is_approved } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (position !== undefined) {
      updates.push("position = ?");
      params.push(position);
    }
    if (rating !== undefined) {
      updates.push("rating = ?");
      params.push(rating);
    }
    if (message !== undefined) {
      updates.push("message = ?");
      params.push(message);
    }
    if (image) {
      updates.push("image = ?");
      params.push(image);
    }
    if (is_approved !== undefined) {
      updates.push("is_approved = ?");
      params.push(is_approved);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE testimonials SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ message: "Testimonial updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update testimonial" });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM testimonials WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
};
