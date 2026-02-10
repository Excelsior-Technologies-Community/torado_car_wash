import { VehicleCategory } from "../models/index.js";

export const createVehicleCategory = async (req, res) => {
  try {
    const { name, price_multiplier } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const multiplier = price_multiplier ?? 1.0;
    if (isNaN(multiplier) || multiplier < 0) {
      return res.status(400).json({ message: "Invalid price_multiplier. Must be a positive number." });
    }

    const id = await VehicleCategory.create({
      name,
      image,
      price_multiplier: multiplier
    });

    res.status(201).json({ id, name, image, price_multiplier: multiplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create vehicle category" });
  }
};

export const getAllVehicleCategories = async (req, res) => {
  try {
    const categories = await VehicleCategory.getActiveCategories();
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

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (price_multiplier !== undefined) {
      const multiplier = price_multiplier ?? 1.0;
      if (isNaN(multiplier) || multiplier < 0) {
        return res.status(400).json({ message: "Invalid price_multiplier. Must be a positive number." });
      }
      updates.price_multiplier = multiplier;
    }
    if (image) updates.image = image;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await VehicleCategory.update(id, updates);
    res.json({ message: "Vehicle category updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update vehicle category" });
  }
};

export const deleteVehicleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await VehicleCategory.softDelete(id);
    res.json({ message: "Vehicle category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete vehicle category" });
  }
};
