import pool from "../config/db.js";
import { getPagination } from "../utils/pagination.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    // Validate numeric fields
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (
      stock_quantity !== undefined &&
      (isNaN(stock_quantity) || stock_quantity < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a positive number",
      });
    }

    if (category_id && isNaN(category_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, stock_quantity, category_id, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [name, description, price, stock_quantity || 0, category_id],
    );

    if (req.files && req.files.length > 0) {
      const imageQueries = req.files.map((file) =>
        pool.query(
          `INSERT INTO product_images (product_id, image_path) VALUES (?, ?)`,
          [result.insertId, file.filename],
        ),
      );
      await Promise.all(imageQueries);
    }

    const [product] = await pool.query(
      `SELECT p.*, pc.name as category_name, 
       GROUP_CONCAT(pi.image_path) as images
       FROM products p 
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE p.id = ? GROUP BY p.id`,
      [result.insertId],
    );

    return res.status(201).json({
      success: true,
      data: product[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category_id, search } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    const { offset } = getPagination(pageNum, limitNum);

    let whereClause = "WHERE p.is_active = 1";
    let params = [];

    if (category_id) {
      if (isNaN(category_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      whereClause += " AND p.category_id = ?";
      params.push(category_id);
    }

    if (search) {
      whereClause += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const [products] = await pool.query(
      `SELECT p.*, pc.name as category_name,
       GROUP_CONCAT(pi.image_path) as images
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       ${whereClause}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params,
    );

    return res.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        images: p.images ? p.images.split(",") : [],
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await pool.query(
      `SELECT p.*, pc.name as category_name,
       GROUP_CONCAT(pi.image_path) as images
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE p.id = ? AND p.is_active = 1
       GROUP BY p.id`,
      [id],
    );

    if (!product[0]) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: {
        ...product[0],
        images: product[0].images ? product[0].images.split(",") : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id } = req.body;

    // Validate ID parameter
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if product exists
    const [existingProduct] = await pool.query(
      "SELECT id FROM products WHERE id = ? AND is_active = 1",
      [id],
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number",
        });
      }
      updates.push("price = ?");
      values.push(price);
    }
    if (stock_quantity !== undefined) {
      if (isNaN(stock_quantity) || stock_quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock quantity must be a positive number",
        });
      }
      updates.push("stock_quantity = ?");
      values.push(stock_quantity);
    }
    if (category_id !== undefined) {
      if (category_id && isNaN(category_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      updates.push("category_id = ?");
      values.push(category_id);
    }

    if (updates.length > 0) {
      values.push(id);
      await pool.query(
        `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
        values,
      );
    }

    if (req.files && req.files.length > 0) {
      const imageQueries = req.files.map((file) =>
        pool.query(
          `INSERT INTO product_images (product_id, image_path) VALUES (?, ?)`,
          [id, file.filename],
        ),
      );
      await Promise.all(imageQueries);
    }

    // Only fetch updated product if changes were made
    if (updates.length > 0 || (req.files && req.files.length > 0)) {
      const [product] = await pool.query(
        `SELECT p.*, pc.name as category_name,
         GROUP_CONCAT(pi.image_path) as images
         FROM products p
         LEFT JOIN product_categories pc ON p.category_id = pc.id
         LEFT JOIN product_images pi ON p.id = pi.product_id
         WHERE p.id = ?
         GROUP BY p.id`,
        [id],
      );

      return res.json({
        success: true,
        data: {
          ...product[0],
          images: product[0].images ? product[0].images.split(",") : [],
        },
      });
    }

    return res.json({
      success: true,
      message: "No changes made",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`UPDATE products SET is_active = 0 WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    await pool.query(`DELETE FROM product_images WHERE id = ?`, [imageId]);

    return res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Category Controllers
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const [result] = await pool.query(
      `INSERT INTO product_categories (name, slug, is_active) VALUES (?, ?, 1)`,
      [name, slug],
    );

    const [category] = await pool.query(
      `SELECT * FROM product_categories WHERE id = ?`,
      [result.insertId],
    );

    return res.status(201).json({
      success: true,
      data: category[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT * FROM product_categories WHERE is_active = 1 ORDER BY name`,
    );

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
