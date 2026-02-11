import pool from "../config/db.js";
import { getPagination } from "../utils/pagination.js";

export const createTeamMember = async (req, res) => {
  try {
    const { name, designation, facebook_url, linkedin_url, instagram_url, twitter_url, display_order } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !designation) {
      return res.status(400).json({ message: "Name and designation are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO team_members (name, designation, image, facebook_url, linkedin_url, instagram_url, twitter_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, designation, image, facebook_url, linkedin_url, instagram_url, twitter_url, display_order || 0]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      designation,
      image,
      facebook_url,
      linkedin_url,
      instagram_url,
      twitter_url,
      display_order: display_order || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create team member" });
  }
};

export const getAllTeamMembers = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    const [teamMembers] = await pool.query(
      "SELECT * FROM team_members WHERE is_active = TRUE ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?",
      [queryLimit, offset]
    );

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM team_members WHERE is_active = TRUE"
    );

    res.json({
      data: teamMembers,
      pagination: {
        page: Number(page),
        limit: queryLimit,
        total,
        totalPages: Math.ceil(total / queryLimit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};

export const getSingleTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const [teamMembers] = await pool.query(
      "SELECT * FROM team_members WHERE id = ? AND is_active = TRUE",
      [id]
    );

    if (teamMembers.length === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json(teamMembers[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch team member" });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, facebook_url, linkedin_url, instagram_url, twitter_url, display_order } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (designation !== undefined) {
      updates.push("designation = ?");
      params.push(designation);
    }
    if (image) {
      updates.push("image = ?");
      params.push(image);
    }
    if (facebook_url !== undefined) {
      updates.push("facebook_url = ?");
      params.push(facebook_url);
    }
    if (linkedin_url !== undefined) {
      updates.push("linkedin_url = ?");
      params.push(linkedin_url);
    }
    if (instagram_url !== undefined) {
      updates.push("instagram_url = ?");
      params.push(instagram_url);
    }
    if (twitter_url !== undefined) {
      updates.push("twitter_url = ?");
      params.push(twitter_url);
    }
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      params.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE team_members SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json({ message: "Team member updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update team member" });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE team_members SET is_active = FALSE WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete team member" });
  }
};