import BaseModel from "./BaseModel.js";

class Cart extends BaseModel {
  constructor() {
    super("carts");
  }

  async addToCart(userId, productId, quantity) {
    return await this.callProcedure("sp_add_to_cart", [
      userId,
      productId,
      quantity,
    ]);
  }

  async getUserCart(userId) {
    const [rows] = await this.pool.query(
      `SELECT c.*, p.name, p.price, p.stock_quantity,
       (c.quantity * p.price) as subtotal,
       pi.image_path
       FROM carts c
       JOIN products p ON c.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE c.user_id = ? AND p.is_active = TRUE
       GROUP BY c.id`,
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

  async updateQuantity(userId, productId, quantity) {
    await this.pool.query(
      "UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, userId, productId]
    );
  }

  async clearCart(userId) {
    await this.pool.query("DELETE FROM carts WHERE user_id = ?", [userId]);
  }
}

export default new Cart();
