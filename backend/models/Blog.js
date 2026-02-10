import BaseModel from "./BaseModel.js";

class Blog extends BaseModel {
  constructor() {
    super("blogs");
  }

  async getBlogWithDetails(blogId) {
    const [rows] = await this.pool.query(
      `SELECT b.*, u.name as author_name, bc.name as category_name,
       GROUP_CONCAT(t.name) as tags
       FROM blogs b
       JOIN users u ON b.author_id = u.id
       LEFT JOIN blog_categories bc ON b.category_id = bc.id
       LEFT JOIN blog_tags bt ON b.id = bt.blog_id
       LEFT JOIN tags t ON bt.tag_id = t.id
       WHERE b.id = ?
       GROUP BY b.id`,
      [blogId]
    );
    return rows[0];
  }

  async getPublishedBlogs(limit = 10, offset = 0) {
    const [rows] = await this.pool.query(
      `SELECT b.*, u.name as author_name, bc.name as category_name
       FROM blogs b
       JOIN users u ON b.author_id = u.id
       LEFT JOIN blog_categories bc ON b.category_id = bc.id
       WHERE b.is_published = TRUE
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async addTags(blogId, tagIds) {
    const values = tagIds.map((tagId) => [blogId, tagId]);
    await this.pool.query(
      "INSERT INTO blog_tags (blog_id, tag_id) VALUES ?",
      [values]
    );
  }
}

export default new Blog();
