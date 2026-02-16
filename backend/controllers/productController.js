import { Product } from "../models/index.js";
import { getPagination } from "../utils/pagination.js";
import pool from "../config/db.js";

const toNullableString = (value) => {
  if (value === undefined || value === null) return undefined;
  const str = String(value).trim();
  return str === "" ? null : str;
};

const toNullableInt = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isInteger(num) ? num : NaN;
};

const toNullableBooleanInt = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (value === true || value === "true" || value === "1" || value === 1) return 1;
  if (value === false || value === "false" || value === "0" || value === 0) return 0;
  return NaN;
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      brand,
      color,
      size,
      weight,
      dimensions,
      additional_info,
      category,
      is_active,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    const parsedStockQuantity = stock_quantity === undefined || stock_quantity === "" ? 0 : Number(stock_quantity);
    if (Number.isNaN(parsedStockQuantity) || parsedStockQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a positive number",
      });
    }

    const parsedCategoryId = toNullableInt(category_id);
    if (Number.isNaN(parsedCategoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const parsedIsActive = toNullableBooleanInt(is_active);
    if (parsedIsActive !== undefined && Number.isNaN(parsedIsActive)) {
      return res.status(400).json({
        success: false,
        message: "Invalid is_active value",
      });
    }

    let parsedAdditionalInfo = null;
    if (additional_info !== undefined && additional_info !== null && String(additional_info).trim() !== "") {
      try {
        parsedAdditionalInfo = JSON.stringify(JSON.parse(additional_info));
      } catch {
        return res.status(400).json({
          success: false,
          message: "additional_info must be valid JSON",
        });
      }
    }

    const productPayload = {
      name: String(name).trim(),
      description: toNullableString(description),
      price: parsedPrice,
      stock_quantity: parsedStockQuantity,
      category_id: parsedCategoryId,
      is_active: parsedIsActive ?? 1,
      brand: toNullableString(brand),
      color: toNullableString(color),
      size: toNullableString(size),
      weight: toNullableString(weight),
      dimensions: toNullableString(dimensions),
      additional_info: parsedAdditionalInfo,
      category: toNullableString(category),
    };

    const productId = await Product.create(productPayload);

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => file.filename);
      await Product.addImages(productId, imagePaths);
    }

    const product = await Product.getProductWithImages(productId);

    return res.status(201).json({
      success: true,
      data: product,
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

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    const { offset } = getPagination(pageNum, limitNum);

    const filters = {};
    if (category_id) {
      if (isNaN(category_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      filters.category_id = category_id;
    }
    if (search) {
      filters.search = search;
    }

    const products = await Product.getProducts(filters, limitNum, offset, { includeInactive: false });
    const totalProducts = await Product.countProducts(filters, { includeInactive: false });

    return res.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        images: p.images ? p.images.split(",") : [],
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalProducts,
        pages: Math.ceil(totalProducts / limitNum),
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

export const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category_id, search } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    const { offset } = getPagination(pageNum, limitNum);

    const filters = {};
    if (category_id) {
      if (isNaN(category_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      filters.category_id = category_id;
    }
    if (search) {
      filters.search = search;
    }

    const products = await Product.getProducts(filters, limitNum, offset, { includeInactive: true });
    const totalProducts = await Product.countProducts(filters, { includeInactive: true });

    return res.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        images: p.images ? p.images.split(",") : [],
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalProducts,
        pages: Math.ceil(totalProducts / limitNum),
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
    const product = await Product.getProductWithImages(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: {
        ...product,
        images: product.images ? product.images.split(",") : [],
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
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      brand,
      color,
      size,
      weight,
      dimensions,
      additional_info,
      category,
      is_active,
    } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const [existingProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updates = {};

    if (name !== undefined) {
      const parsedName = String(name).trim();
      if (!parsedName) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
      updates.name = parsedName;
    }

    if (description !== undefined) updates.description = toNullableString(description);

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number",
        });
      }
      updates.price = parsedPrice;
    }

    if (stock_quantity !== undefined) {
      const parsedStockQuantity = Number(stock_quantity);
      if (Number.isNaN(parsedStockQuantity) || parsedStockQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock quantity must be a positive number",
        });
      }
      updates.stock_quantity = parsedStockQuantity;
    }

    if (category_id !== undefined) {
      const parsedCategoryId = toNullableInt(category_id);
      if (Number.isNaN(parsedCategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      updates.category_id = parsedCategoryId;
    }

    if (brand !== undefined) updates.brand = toNullableString(brand);
    if (color !== undefined) updates.color = toNullableString(color);
    if (size !== undefined) updates.size = toNullableString(size);
    if (weight !== undefined) updates.weight = toNullableString(weight);
    if (dimensions !== undefined) updates.dimensions = toNullableString(dimensions);
    if (category !== undefined) updates.category = toNullableString(category);

    if (is_active !== undefined) {
      const parsedIsActive = toNullableBooleanInt(is_active);
      if (parsedIsActive === undefined || Number.isNaN(parsedIsActive)) {
        return res.status(400).json({
          success: false,
          message: "Invalid is_active value",
        });
      }
      updates.is_active = parsedIsActive;
    }

    if (additional_info !== undefined) {
      const normalizedAdditionalInfo = toNullableString(additional_info);
      if (normalizedAdditionalInfo === null) {
        updates.additional_info = null;
      } else {
        try {
          updates.additional_info = JSON.stringify(JSON.parse(normalizedAdditionalInfo));
        } catch {
          return res.status(400).json({
            success: false,
            message: "additional_info must be valid JSON",
          });
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      const keys = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      
      await pool.query(
        `UPDATE products SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
    }

    if (req.files && req.files.length > 0) {
      await pool.query('DELETE FROM product_images WHERE product_id = ?', [id]);
      const imagePaths = req.files.map(file => file.filename);
      await Product.addImages(id, imagePaths);
    }

    const product = await Product.getProductWithImages(id);

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Update error:', error);
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
    await Product.softDelete(id);

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
    await Product.deleteImage(imageId);

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

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const [reviews] = await pool.query(
      `SELECT pr.id, pr.product_id, pr.user_id, pr.rating, pr.review_content, pr.review_message,
              pr.created_at, u.name as user_name
       FROM product_reviews pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.product_id = ? AND pr.is_approved = 1
       ORDER BY pr.created_at DESC`,
      [id]
    );

    return res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review_content, review_message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const content = toNullableString(review_content);
    const message = toNullableString(review_message);
    if (!content && !message) {
      return res.status(400).json({
        success: false,
        message: "Review content or message is required",
      });
    }

    const [productRows] = await pool.query(
      "SELECT id FROM products WHERE id = ? AND is_active = 1",
      [id]
    );

    if (!productRows || productRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, review_content, review_message, is_approved)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [id, userId, numericRating, content, message]
    );

    const [reviewRows] = await pool.query(
      `SELECT id, product_id, user_id, rating, review_content, review_message, is_approved, created_at, updated_at
       FROM product_reviews WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted and pending approval",
      data: reviewRows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getPendingProductReviews = async (req, res) => {
  try {
    const [reviews] = await pool.query(
      `SELECT pr.id, pr.product_id, pr.user_id, pr.rating, pr.review_content, pr.review_message,
              pr.is_approved, pr.created_at, pr.updated_at,
              p.name as product_name, u.name as user_name, u.email as user_email
       FROM product_reviews pr
       JOIN products p ON pr.product_id = p.id
       JOIN users u ON pr.user_id = u.id
       WHERE pr.is_approved = 0
       ORDER BY pr.created_at DESC`
    );

    return res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const approveProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const [result] = await pool.query(
      `UPDATE product_reviews
       SET is_approved = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [reviewId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.json({
      success: true,
      message: "Review approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const rejectProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (isNaN(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM product_reviews WHERE id = ?",
      [reviewId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.json({
      success: true,
      message: "Review rejected successfully",
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
      'INSERT INTO product_categories (name, slug, is_active) VALUES (?, ?, 1)',
      [name, slug || name.toLowerCase().replace(/\s+/g, '-')]
    );

    const [category] = await pool.query(
      'SELECT * FROM product_categories WHERE id = ?',
      [result.insertId]
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
      'SELECT * FROM product_categories WHERE is_active = 1'
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

export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM product_categories ORDER BY id DESC"
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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, is_active } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }

    if (slug !== undefined) {
      updates.push("slug = ?");
      params.push(slug || String(name || "").toLowerCase().replace(/\s+/g, "-"));
    }

    if (is_active !== undefined) {
      const parsedIsActive = toNullableBooleanInt(is_active);
      if (parsedIsActive === undefined || Number.isNaN(parsedIsActive)) {
        return res.status(400).json({
          success: false,
          message: "Invalid is_active value",
        });
      }
      updates.push("is_active = ?");
      params.push(parsedIsActive);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    params.push(id);
    const [result] = await pool.query(
      `UPDATE product_categories SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const [result] = await pool.query(
      "UPDATE product_categories SET is_active = 0 WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.json({
      success: true,
      message: "Category deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
