import pool from "../config/db.js";
import { deleteFile } from "../utils/fileUtils.js";

export const createService = async (req, res) => {
  try {
    const { name, description, problem_name, problem_description } = req.body;
    const image = req.files?.image?.[0]?.filename || null;
    const icon = req.files?.icon?.[0]?.filename || null;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO services (name, icon, image, description, problem_name, problem_description) VALUES (?, ?, ?, ?, ?, ?)",
      [name, icon, image, description, problem_name, problem_description]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      icon,
      image,
      description,
      problem_name,
      problem_description
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const [services] = await pool.query(
      "SELECT * FROM services WHERE is_active = TRUE"
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
      "SELECT * FROM services WHERE id = ? AND is_active = TRUE",
      [id]
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
    const { name, description, problem_name, problem_description } = req.body;
    const image = req.files?.image?.[0]?.filename;
    const icon = req.files?.icon?.[0]?.filename;

    const [currentService] = await pool.query(
      "SELECT image, icon FROM services WHERE id = ?",
      [id]
    );

    if (currentService.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updates = [];
    const params = [];

    if (name) { updates.push("name = ?"); params.push(name); }
    if (description !== undefined) { updates.push("description = ?"); params.push(description); }
    if (problem_name !== undefined) { updates.push("problem_name = ?"); params.push(problem_name); }
    if (problem_description !== undefined) { updates.push("problem_description = ?"); params.push(problem_description); }
    
    if (image) {
      updates.push("image = ?");
      params.push(image);
      if (currentService[0].image) deleteFile(currentService[0].image);
    }
    if (icon) {
      updates.push("icon = ?");
      params.push(icon);
      if (currentService[0].icon) deleteFile(currentService[0].icon);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    params.push(id);
    await pool.query(`UPDATE services SET ${updates.join(", ")} WHERE id = ?`, params);

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
      [id]
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
