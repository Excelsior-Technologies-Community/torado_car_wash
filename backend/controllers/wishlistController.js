import pool from "../config/db.js";

export const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    await pool.query(
      `INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)`,
      [user_id, product_id]
    );

    const [wishlist] = await pool.query(
      `SELECT w.*, p.name, p.price,
       (SELECT image_path FROM product_images WHERE product_id = p.id LIMIT 1) as image
       FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ? AND w.product_id = ?`,
      [user_id, product_id]
    );

    return res.status(201).json({
      success: true,
      data: wishlist[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [items] = await pool.query(
      `SELECT w.*, p.name, p.price,
       (SELECT image_path FROM product_images WHERE product_id = p.id LIMIT 1) as image
       FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
      [user_id]
    );

    return res.json({
      success: true,
      data: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await pool.query(
      `DELETE FROM wishlists WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );

    return res.json({
      success: true,
      message: "Item removed from wishlist"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    await pool.query(`DELETE FROM wishlists WHERE user_id = ?`, [user_id]);

    return res.json({
      success: true,
      message: "Wishlist cleared"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};