import pool from "../config/db.js";

export const checkout = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const user_id = req.user.id;
    
    // Get cart items
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

    // Calculate total
    const total_amount = cartItems.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`,
      [user_id, total_amount]
    );

    const order_id = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
         VALUES (?, ?, ?, ?)`,
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await connection.query(`DELETE FROM carts WHERE user_id = ?`, [user_id]);

    await connection.commit();

    res.status(201).json({
      success: true,
      data: { order_id, total_amount }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Checkout failed",
      error: error.message
    });
  } finally {
    connection.release();
  }
};

export const getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [order] = await pool.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const [orderItems] = await pool.query(
      `SELECT oi.*, p.name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...order[0],
        items: orderItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Get current order status
    const [currentOrder] = await connection.query(
      `SELECT status FROM orders WHERE id = ?`,
      [id]
    );
    
    if (currentOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    const oldStatus = currentOrder[0].status;
    
    await connection.beginTransaction();
    
    // If cancelling order, restore stock
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
    
    // Update order status
    await connection.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id]
    );
    
    await connection.commit();

    res.json({
      success: true,
      message: "Order status updated"
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
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
    
    const [order] = await connection.query(
      `SELECT status FROM orders WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
    
    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    if (order[0].status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled"
      });
    }
    
    await connection.beginTransaction();
    
    // Restore stock
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
    
    // Update order status
    await connection.query(
      `UPDATE orders SET status = 'Cancelled' WHERE id = ?`,
      [id]
    );
    
    await connection.commit();
    
    res.json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  } finally {
    connection.release();
  }
};