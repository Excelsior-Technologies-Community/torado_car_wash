import pool from "../config/db.js";
import { deleteFile } from "../utils/fileUtils.js";

export const createService = async (req, res) => {
  try {
    const { wash_type_id, title, description, duration_minutes, base_price } =
      req.body;
    const image = req.files?.image?.[0]?.filename || null;
    const icon = req.files?.icon?.[0]?.filename || null;

    if (!wash_type_id || !title || !base_price) {
      return res
        .status(400)
        .json({ message: "wash_type_id, title, and base_price are required" });
    }

    // Validate numeric inputs
    if (
      isNaN(wash_type_id) ||
      isNaN(base_price) ||
      (duration_minutes && isNaN(duration_minutes))
    ) {
      return res.status(400).json({ message: "Invalid numeric values" });
    }

    // Check if wash_type_id exists
    const [washTypes] = await pool.query(
      "SELECT id FROM wash_types WHERE id = ?",
      [wash_type_id],
    );

    if (washTypes.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid wash_type_id. Wash type does not exist." });
    }

    const [result] = await pool.query(
      "INSERT INTO services (wash_type_id, title, description, duration_minutes, base_price, image, icon) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        wash_type_id,
        title,
        description,
        duration_minutes || 30,
        base_price,
        image,
        icon,
      ],
    );

    res.status(201).json({
      id: result.insertId,
      wash_type_id,
      title,
      description,
      duration_minutes: duration_minutes || 30,
      base_price,
      image,
      icon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const [services] = await pool.query(
      `SELECT s.*, wt.name as wash_type_name 
       FROM services s 
       JOIN wash_types wt ON s.wash_type_id = wt.id 
       WHERE s.is_active = TRUE`,
    );
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const getSingleService = async (req, res) => {
  try {
    const { id } = req.params;
    const [services] = await pool.query(
      `SELECT s.*, wt.name as wash_type_name 
       FROM services s 
       JOIN wash_types wt ON s.wash_type_id = wt.id 
       WHERE s.id = ? AND s.is_active = TRUE`,
      [id],
    );

    if (services.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(services[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { wash_type_id, title, description, duration_minutes, base_price } =
      req.body;
    const image = req.files?.image?.[0]?.filename || undefined;
    const icon = req.files?.icon?.[0]?.filename || undefined;

    // Validate ID parameter
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    // Get current service data for cleanup
    const [currentService] = await pool.query(
      "SELECT image, icon FROM services WHERE id = ?",
      [id],
    );

    if (currentService.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updates = [];
    const params = [];

    if (wash_type_id !== undefined) {
      if (isNaN(wash_type_id)) {
        return res.status(400).json({ message: "Invalid wash_type_id" });
      }
      // Validate wash_type_id exists
      const [washTypes] = await pool.query(
        "SELECT id FROM wash_types WHERE id = ?",
        [wash_type_id],
      );
      if (washTypes.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid wash_type_id. Wash type does not exist." });
      }
      updates.push("wash_type_id = ?");
      params.push(wash_type_id);
    }
    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }
    if (duration_minutes !== undefined) {
      if (isNaN(duration_minutes)) {
        return res.status(400).json({ message: "Invalid duration_minutes" });
      }
      updates.push("duration_minutes = ?");
      params.push(duration_minutes);
    }
    if (base_price !== undefined) {
      if (isNaN(base_price)) {
        return res.status(400).json({ message: "Invalid base_price" });
      }
      updates.push("base_price = ?");
      params.push(base_price);
    }
    if (image) {
      updates.push("image = ?");
      params.push(image);
      // Delete old image
      if (currentService[0].image) {
        deleteFile(currentService[0].image);
      }
    }
    if (icon) {
      updates.push("icon = ?");
      params.push(icon);
      // Delete old icon
      if (currentService[0].icon) {
        deleteFile(currentService[0].icon);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE services SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE services SET is_active = FALSE WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};

export const getServicePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const [pricing] = await pool.query(
      `SELECT svp.*, vc.name as vehicle_category_name 
       FROM service_vehicle_pricing svp 
       JOIN vehicle_categories vc ON svp.vehicle_category_id = vc.id 
       WHERE svp.service_id = ? AND vc.is_active = TRUE`,
      [id],
    );

    res.json(pricing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch service pricing" });
  }
};
