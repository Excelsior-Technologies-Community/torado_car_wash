import { Product } from "../models/index.js";
import { getPagination } from "../utils/pagination.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
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

    const productId = await Product.create({
      name,
      description,
      price,
      stock_quantity: stock_quantity || 0,
      category_id,
      is_active: true
    });

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

    const products = await Product.getProducts(filters, limitNum, offset);
    const allProducts = await Product.findAll({ is_active: true });

    return res.json({
      success: true,
      data: products.map((p) => ({
        ...p,
        images: p.images ? p.images.split(",") : [],
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allProducts.length,
        pages: Math.ceil(allProducts.length / limitNum),
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
    const { name, description, price, stock_quantity, category_id } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct || !existingProduct.is_active) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number",
        });
      }
      updates.price = price;
    }
    if (stock_quantity !== undefined) {
      if (isNaN(stock_quantity) || stock_quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock quantity must be a positive number",
        });
      }
      updates.stock_quantity = stock_quantity;
    }
    if (category_id !== undefined) {
      if (category_id && isNaN(category_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      updates.category_id = category_id;
    }

    if (Object.keys(updates).length > 0) {
      await Product.update(id, updates);
    }

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => file.filename);
      await Product.addImages(id, imagePaths);
    }

    if (Object.keys(updates).length > 0 || (req.files && req.files.length > 0)) {
      const product = await Product.getProductWithImages(id);

      return res.json({
        success: true,
        data: {
          ...product,
          images: product.images ? product.images.split(",") : [],
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

// Category Controllers
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const categoryId = await Product.create({
      name,
      slug,
      is_active: true
    });

    const category = await Product.findById(categoryId);

    return res.status(201).json({
      success: true,
      data: category,
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
    const categories = await Product.findAll({ is_active: true });

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
