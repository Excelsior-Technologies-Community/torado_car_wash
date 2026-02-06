import pool from "../config/db.js";

export const createServicePricing = async (req, res) => {
  try {
    const { service_id, vehicle_category_id, final_price } = req.body;

    if (!service_id || !vehicle_category_id || !final_price) {
      return res.status(400).json({ 
        message: "service_id, vehicle_category_id, and final_price are required" 
      });
    }

    // Check if service exists
    const [services] = await pool.query(
      "SELECT id FROM services WHERE id = ? AND is_active = TRUE",
      [service_id]
    );
    if (services.length === 0) {
      return res.status(400).json({ message: "Invalid service" });
    }

    // Check if vehicle category exists
    const [categories] = await pool.query(
      "SELECT id FROM vehicle_categories WHERE id = ? AND is_active = TRUE",
      [vehicle_category_id]
    );
    if (categories.length === 0) {
      return res.status(400).json({ message: "Invalid vehicle category" });
    }

    const [result] = await pool.query(
      "INSERT INTO service_vehicle_pricing (service_id, vehicle_category_id, final_price) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE final_price = VALUES(final_price)",
      [service_id, vehicle_category_id, final_price]
    );

    res.status(201).json({
      message: "Service pricing created/updated successfully",
      service_id,
      vehicle_category_id,
      final_price
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service pricing" });
  }
};

export const getServicePricing = async (req, res) => {
  try {
    const { service_id } = req.params;

    const [pricing] = await pool.query(`
      SELECT svp.*, vc.name as vehicle_category_name, s.title as service_title
      FROM service_vehicle_pricing svp
      JOIN vehicle_categories vc ON svp.vehicle_category_id = vc.id
      JOIN services s ON svp.service_id = s.id
      WHERE svp.service_id = ? AND vc.is_active = TRUE AND s.is_active = TRUE
      ORDER BY vc.name
    `, [service_id]);

    res.json(pricing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch service pricing" });
  }
};

export const getAllServicePricing = async (req, res) => {
  try {
    const [pricing] = await pool.query(`
      SELECT svp.*, vc.name as vehicle_category_name, s.title as service_title
      FROM service_vehicle_pricing svp
      JOIN vehicle_categories vc ON svp.vehicle_category_id = vc.id
      JOIN services s ON svp.service_id = s.id
      WHERE vc.is_active = TRUE AND s.is_active = TRUE
      ORDER BY s.title, vc.name
    `);

    res.json(pricing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch all service pricing" });
  }
};

export const updateServicePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { final_price } = req.body;

    if (!final_price) {
      return res.status(400).json({ message: "final_price is required" });
    }

    const [result] = await pool.query(
      "UPDATE service_vehicle_pricing SET final_price = ? WHERE id = ?",
      [final_price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service pricing not found" });
    }

    res.json({ message: "Service pricing updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service pricing" });
  }
};

export const deleteServicePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM service_vehicle_pricing WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service pricing not found" });
    }

    res.json({ message: "Service pricing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete service pricing" });
  }
};