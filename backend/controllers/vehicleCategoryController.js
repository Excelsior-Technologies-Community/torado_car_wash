import pool from "../config/db.js";

export const createVehicleCategory = async (req, res) => {
  try {
    const { name, price_multiplier } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Validate price_multiplier
    const multiplier = price_multiplier ?? 1.0;
    if (isNaN(multiplier) || multiplier < 0) {
      return res.status(400).json({ message: "Invalid price_multiplier. Must be a positive number." });
    }

    const [result] = await pool.query(
      "INSERT INTO vehicle_categories (name, image, price_multiplier) VALUES (?, ?, ?)",
      [name, image, multiplier],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      image,
      price_multiplier: multiplier,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create vehicle category" });
  }
};

export const getAllVehicleCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM vehicle_categories WHERE is_active = TRUE ORDER BY name",
    );
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vehicle categories" });
  }
};

export const updateVehicleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price_multiplier } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Validate ID parameter
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (price_multiplier !== undefined) {
      const multiplier = price_multiplier ?? 1.0;
      if (isNaN(multiplier) || multiplier < 0) {
        return res.status(400).json({ message: "Invalid price_multiplier. Must be a positive number." });
      }
      updates.push("price_multiplier = ?");
      params.push(multiplier);
    }
    if (image) {
      updates.push("image = ?");
      params.push(image);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE vehicle_categories SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vehicle category not found" });
    }

    res.json({ message: "Vehicle category updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update vehicle category" });
  }
};

export const deleteVehicleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE vehicle_categories SET is_active = FALSE WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vehicle category not found" });
    }

    res.json({ message: "Vehicle category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete vehicle category" });
  }
};
