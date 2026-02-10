import BaseModel from "./BaseModel.js";

class Order extends BaseModel {
  constructor() {
    super("orders");
  }

  async createOrder(userId, productIds, quantities) {
    return await this.callProcedure("sp_create_order", [
      userId,
      productIds,
      quantities,
    ]);
  }

  async getOrderWithItems(orderId) {
    const [order] = await this.pool.query(
      `SELECT o.*, u.name as user_name, u.email, u.phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [orderId]
    );

    const [items] = await this.pool.query(
      `SELECT oi.*, p.name as product_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return {
      ...order[0],
      items,
    };
  }

  async getUserOrders(userId) {
    const [rows] = await this.pool.query(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  }
}

export default new Order();
