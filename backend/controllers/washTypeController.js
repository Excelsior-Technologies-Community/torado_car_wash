import pool from "../config/db.js";

export const createWashType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO wash_types (name, description, is_active) VALUES (?, ?, TRUE)",
      [name, description || null],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      is_active: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create wash type" });
  }
};

export const getAllWashTypes = async (req, res) => {
  try {
    const [washTypes] = await pool.query(
      "SELECT * FROM wash_types WHERE is_active = TRUE",
    );

    for (let washType of washTypes) {
      const [features] = await pool.query(
        `SELECT f.* FROM features f
         JOIN wash_type_features wtf ON f.id = wtf.feature_id
         WHERE wtf.wash_type_id = ? AND f.is_active = TRUE`,
        [washType.id],
      );
      washType.features = features;
    }

    res.json(washTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wash types" });
  }
};

export const createFeature = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const [result] = await pool.query(
      "INSERT INTO features (name, icon, is_active) VALUES (?, ?, TRUE)",
      [name, icon || null],
    );
    res.status(201).json({ id: result.insertId, name, icon, is_active: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to create feature" });
  }
};

export const addFeatureToWashType = async (req, res) => {
  try {
    const { wash_type_id, feature_id } = req.body;
    await pool.query(
      "INSERT INTO wash_type_features (wash_type_id, feature_id) VALUES (?, ?)",
      [wash_type_id, feature_id],
    );
    res.status(201).json({ message: "Feature added to wash type" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add feature" });
  }
};

export const updateWashType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query(
      "UPDATE wash_types SET name = ?, description = ? WHERE id = ?",
      [name, description, id],
    );
    res.json({ message: "Wash type updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update wash type" });
  }
};

export const deleteWashType = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE wash_types SET is_active = FALSE WHERE id = ?", [
      id,
    ]);
    res.json({ message: "Wash type deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete wash type" });
  }
};

export const getAllFeatures = async (req, res) => {
  try {
    const [features] = await pool.query(
      "SELECT * FROM features WHERE is_active = TRUE",
    );
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch features" });
  }
};

export const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    await pool.query("UPDATE features SET name = ?, icon = ? WHERE id = ?", [
      name,
      icon,
      id,
    ]);
    res.json({ message: "Feature updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update feature" });
  }
};

export const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE features SET is_active = FALSE WHERE id = ?", [
      id,
    ]);
    res.json({ message: "Feature deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete feature" });
  }
};

export const removeFeatureFromWashType = async (req, res) => {
  try {
    const { wash_type_id, feature_id } = req.body;
    await pool.query(
      "DELETE FROM wash_type_features WHERE wash_type_id = ? AND feature_id = ?",
      [wash_type_id, feature_id],
    );
    res.json({ message: "Feature removed from wash type" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove feature" });
  }
};
