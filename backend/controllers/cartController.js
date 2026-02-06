import pool from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const user_id = req.user.id;

    await pool.query(
      `INSERT INTO carts (user_id, product_id, quantity) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [user_id, product_id, quantity]
    );

    const [cart] = await pool.query(
      `SELECT c.*, p.name, p.price 
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ? AND c.product_id = ?`,
      [user_id, product_id]
    );

    return res.status(201).json({
      success: true,
      data: cart[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [items] = await pool.query(
      `SELECT c.*, p.name, p.price, (c.quantity * p.price) as total
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
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

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    await pool.query(
      `UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?`,
      [quantity, id, user_id]
    );

    const [cart] = await pool.query(
      `SELECT c.*, p.name, p.price 
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.id = ?`,
      [id]
    );

    return res.json({
      success: true,
      data: cart[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await pool.query(
      `DELETE FROM carts WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );

    return res.json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    await pool.query(`DELETE FROM carts WHERE user_id = ?`, [user_id]);

    return res.json({
      success: true,
      message: "Cart cleared"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};