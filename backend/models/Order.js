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
    try {
      const [order] = await this.pool.query(
        `SELECT o.*, u.name as user_name, u.email, u.phone
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );

      const [items] = await this.pool.query(
        `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity,
         p.name as product_name, p.price,
         (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) as product_image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      console.log('Order items from DB:', items);

      const processedItems = items.map(item => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        price: item.price
      }));

      return {
        ...order[0],
        items: processedItems,
      };
    } catch (error) {
      console.error('Error in getOrderWithItems:', error);
      throw error;
    }
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
