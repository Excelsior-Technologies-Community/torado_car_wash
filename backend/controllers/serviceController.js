import { Service } from "../models/index.js";
import { deleteFile } from "../utils/fileUtils.js";

export const createService = async (req, res) => {
  try {
    const { name, description, problem_name, problem_description } = req.body;
    const image = req.files?.image?.[0]?.filename || null;
    const icon = req.files?.icon?.[0]?.filename || null;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const id = await Service.create({
      name,
      icon,
      image,
      description,
      problem_name,
      problem_description
    });

    res.status(201).json({ id, name, icon, image, description, problem_name, problem_description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({ is_active: true });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const getSingleService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service || !service.is_active) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
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

    const currentService = await Service.findById(id);

    if (!currentService) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updates = {};

    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (problem_name !== undefined) updates.problem_name = problem_name;
    if (problem_description !== undefined) updates.problem_description = problem_description;
    
    if (image) {
      updates.image = image;
      if (currentService.image) deleteFile(currentService.image);
    }
    if (icon) {
      updates.icon = icon;
      if (currentService.icon) deleteFile(currentService.icon);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await Service.update(id, updates);
    res.json({ message: "Service updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.softDelete(id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
