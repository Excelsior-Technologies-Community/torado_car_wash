import { Cart } from "../models/index.js";

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const user_id = req.user.id;

    const result = await Cart.addToCart(user_id, product_id, quantity);

    return res.status(201).json({
      success: true,
      message: result.message || "Product added to cart"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const items = await Cart.getUserCart(user_id);

    return res.json({
      success: true,
      data: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    await Cart.updateQuantity(user_id, id, quantity);

    return res.json({
      success: true,
      message: "Cart updated"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await Cart.removeFromCart(user_id, id);

    return res.json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    await Cart.clearCart(user_id);

    return res.json({
      success: true,
      message: "Cart cleared"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};