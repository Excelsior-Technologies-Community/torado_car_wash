import BaseModel from "./BaseModel.js";

class Product extends BaseModel {
  constructor() {
    super("products");
  }

  async getProductWithImages(productId) {
    const [rows] = await this.pool.query(
      `SELECT p.*, pc.name as category_name,
       GROUP_CONCAT(pi.image_path) as images
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE p.id = ? AND p.is_active = 1
       GROUP BY p.id`,
      [productId]
    );
    return rows[0];
  }

  async getProducts(filters = {}, limit = 10, offset = 0) {
    let whereClause = "WHERE p.is_active = 1";
    const params = [];

    if (filters.category_id) {
      whereClause += " AND p.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.search) {
      whereClause += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [rows] = await this.pool.query(
      `SELECT p.*, pc.name as category_name,
       GROUP_CONCAT(pi.image_path) as images
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       ${whereClause}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return rows;
  }

  async addImages(productId, imagePaths) {
    const values = imagePaths.map((path) => [productId, path]);
    await this.pool.query(
      "INSERT INTO product_images (product_id, image_path) VALUES ?",
      [values]
    );
  }

  async deleteImage(imageId) {
    await this.pool.query("DELETE FROM product_images WHERE id = ?", [imageId]);
  }
}

export default new Product();
