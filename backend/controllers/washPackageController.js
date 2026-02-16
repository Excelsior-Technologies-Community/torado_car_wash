import pool from "../config/db.js";
import { deleteFile } from "../utils/fileUtils.js";

// Get all wash packages with features and pricing
export const getAllWashPackages = async (req, res) => {
  try {
    const [packages] = await pool.query(
      "SELECT * FROM wash_packages WHERE is_active = TRUE ORDER BY display_order"
    );

    for (let pkg of packages) {
      const [features] = await pool.query(
        `SELECT wf.* FROM wash_features wf
         JOIN wash_package_features wpf ON wf.id = wpf.feature_id
         WHERE wpf.wash_package_id = ? AND wf.is_active = TRUE`,
        [pkg.id]
      );
      pkg.features = features;

      const [pricing] = await pool.query(
        `SELECT wpvp.*, vc.name as vehicle_category_name
         FROM wash_package_vehicle_pricing wpvp
         JOIN vehicle_categories vc ON wpvp.vehicle_category_id = vc.id
         WHERE wpvp.wash_package_id = ? AND vc.is_active = TRUE`,
        [pkg.id]
      );
      pkg.pricing = pricing;
    }

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wash packages" });
  }
};

// Get single wash package
export const getSingleWashPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const [packages] = await pool.query(
      "SELECT * FROM wash_packages WHERE id = ? AND is_active = TRUE",
      [id]
    );

    if (packages.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    const pkg = packages[0];
    const [features] = await pool.query(
      `SELECT wf.* FROM wash_features wf
       JOIN wash_package_features wpf ON wf.id = wpf.feature_id
       WHERE wpf.wash_package_id = ?`,
      [id]
    );
    pkg.features = features;

    const [pricing] = await pool.query(
      `SELECT wpvp.*, vc.name as vehicle_category_name
       FROM wash_package_vehicle_pricing wpvp
       JOIN vehicle_categories vc ON wpvp.vehicle_category_id = vc.id
       WHERE wpvp.wash_package_id = ?`,
      [id]
    );
    pkg.pricing = pricing;

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch package" });
  }
};

// Create wash package
export const createWashPackage = async (req, res) => {
  try {
    const { name, title, description, duration_minutes, base_price, display_order } = req.body;
    const icon = req.files?.icon?.[0]?.filename || null;
    const image = req.files?.image?.[0]?.filename || null;

    const [result] = await pool.query(
      "INSERT INTO wash_packages (name, title, description, icon, image, duration_minutes, base_price, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, title, description, icon, image, duration_minutes, base_price, display_order || 0]
    );

    res.status(201).json({ id: result.insertId, message: "Package created" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create package" });
  }
};

// Update wash package
export const updateWashPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, duration_minutes, base_price, display_order } = req.body;
    const icon = req.files?.icon?.[0]?.filename;
    const image = req.files?.image?.[0]?.filename;

    const [current] = await pool.query("SELECT icon, image FROM wash_packages WHERE id = ?", [id]);
    if (current.length === 0) return res.status(404).json({ message: "Package not found" });

    const updates = [];
    const params = [];

    if (name) { updates.push("name = ?"); params.push(name); }
    if (title) { updates.push("title = ?"); params.push(title); }
    if (description) { updates.push("description = ?"); params.push(description); }
    if (duration_minutes) { updates.push("duration_minutes = ?"); params.push(duration_minutes); }
    if (base_price) { updates.push("base_price = ?"); params.push(base_price); }
    if (display_order !== undefined) { updates.push("display_order = ?"); params.push(display_order); }
    if (icon) { 
      updates.push("icon = ?"); 
      params.push(icon);
      if (current[0].icon) deleteFile(current[0].icon);
    }
    if (image) { 
      updates.push("image = ?"); 
      params.push(image);
      if (current[0].image) deleteFile(current[0].image);
    }

    if (updates.length === 0) return res.status(400).json({ message: "No fields to update" });

    params.push(id);
    await pool.query(`UPDATE wash_packages SET ${updates.join(", ")} WHERE id = ?`, params);

    res.json({ message: "Package updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update package" });
  }
};

// Delete wash package
export const deleteWashPackage = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE wash_packages SET is_active = FALSE WHERE id = ?", [id]);
    res.json({ message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete package" });
  }
};

// WASH FEATURES CRUD
export const getAllWashFeatures = async (req, res) => {
  try {
    const [features] = await pool.query("SELECT * FROM wash_features WHERE is_active = TRUE");
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch features" });
  }
};

export const createWashFeature = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const [result] = await pool.query(
      "INSERT INTO wash_features (name, icon) VALUES (?, ?)",
      [name, icon]
    );
    res.status(201).json({ id: result.insertId, message: "Feature created" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create feature" });
  }
};

export const updateWashFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    await pool.query("UPDATE wash_features SET name = ?, icon = ? WHERE id = ?", [name, icon, id]);
    res.json({ message: "Feature updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update feature" });
  }
};

export const deleteWashFeature = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE wash_features SET is_active = FALSE WHERE id = ?", [id]);
    res.json({ message: "Feature deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete feature" });
  }
};

// Assign/Remove features
export const addFeatureToPackage = async (req, res) => {
  try {
    const { wash_package_id, feature_id } = req.body;
    await pool.query(
      "INSERT INTO wash_package_features (wash_package_id, feature_id) VALUES (?, ?)",
      [wash_package_id, feature_id]
    );
    res.status(201).json({ message: "Feature added to package" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add feature" });
  }
};

export const removeFeatureFromPackage = async (req, res) => {
  try {
    const { wash_package_id, feature_id } = req.body;
    await pool.query(
      "DELETE FROM wash_package_features WHERE wash_package_id = ? AND feature_id = ?",
      [wash_package_id, feature_id]
    );
    res.json({ message: "Feature removed from package" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove feature" });
  }
};

// Package pricing CRUD
export const setPackagePricing = async (req, res) => {
  try {
    const { wash_package_id, vehicle_category_id, final_price } = req.body;
    await pool.query(
      `INSERT INTO wash_package_vehicle_pricing (wash_package_id, vehicle_category_id, final_price) 
       VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE final_price = ?`,
      [wash_package_id, vehicle_category_id, final_price, final_price]
    );
    res.status(201).json({ message: "Pricing set" });
  } catch (error) {
    res.status(500).json({ message: "Failed to set pricing" });
  }
};

export const deletePackagePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM wash_package_vehicle_pricing WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Pricing entry not found" });
    }

    res.json({ message: "Pricing deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pricing" });
  }
};
