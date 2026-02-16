import BaseModel from "./BaseModel.js";

class Cart extends BaseModel {
  constructor() {
    super("carts");
  }

  async addToCart(userId, productId, quantity) {
    // Check if product already exists in cart
    const [existing] = await this.pool.query(
      'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      // Update quantity if exists
      await this.pool.query(
        'UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
      return { message: 'Cart updated successfully' };
    } else {
      // Insert new cart item
      await this.pool.query(
        'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      return { message: 'Product added to cart' };
    }
  }

  async getUserCart(userId) {
    const [rows] = await this.pool.query(
      `SELECT c.id, c.product_id, c.quantity, c.user_id,
       p.name, p.price, p.stock_quantity,
       (c.quantity * p.price) as subtotal,
       (SELECT image_path FROM product_images WHERE product_id = p.id LIMIT 1) as image_path
       FROM carts c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND p.is_active = TRUE`,
      [userId]
    );
    return rows;
  }

  async removeFromCart(userId, productId) {
    await this.pool.query(
      "DELETE FROM carts WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
  }

  async updateQuantity(userId, cartId, quantity) {
    await this.pool.query(
      "UPDATE carts SET quantity = ? WHERE user_id = ? AND id = ?",
      [quantity, userId, cartId]
    );
  }

  async clearCart(userId) {
    await this.pool.query("DELETE FROM carts WHERE user_id = ?", [userId]);
  }
}

export default new Cart();
