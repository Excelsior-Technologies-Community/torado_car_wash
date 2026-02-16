import { Order, Cart } from "../models/index.js";
import pool from "../config/db.js";

export const checkout = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const user_id = req.user.id;
    
    const [cartItems] = await connection.query(
      `SELECT c.product_id, c.quantity, p.price 
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const productIds = cartItems.map(item => item.product_id).join(',');
    const quantities = cartItems.map(item => item.quantity).join(',');

    const result = await Order.createOrder(user_id, productIds, quantities);

    await Cart.clearCart(user_id);

    await connection.commit();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    connection.release();
  }
};

export const getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await Order.getUserOrders(user_id);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.getOrderWithItems(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Order details error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [currentOrder] = await connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    
    if (!currentOrder || currentOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    const oldStatus = currentOrder[0].status;
    
    await connection.beginTransaction();
    
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      const [orderItems] = await connection.query(
        `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
        [id]
      );
      
      for (const item of orderItems) {
        await connection.query(
          `UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?`,
          [item.quantity, item.product_id]
        );
      }
    }
    
    await connection.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    await connection.commit();

    res.json({
      success: true,
      message: "Order status updated"
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    connection.release();
  }
};

export const cancelOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const order = await Order.findById(id);
    
    if (!order || order.user_id !== user_id) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    if (order.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled"
      });
    }
    
    await connection.beginTransaction();
    
    const [orderItems] = await connection.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
      [id]
    );
    
    for (const item of orderItems) {
      await connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }
    
    await Order.update(id, { status: 'Cancelled' });
    
    await connection.commit();
    
    res.json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    connection.release();
  }
};