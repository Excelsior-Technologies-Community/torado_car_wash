import pool from "../config/db.js";
import { getPagination } from "../utils/pagination.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, author_id, category_id, tags, is_published = 0 } = req.body;

    const featured_image = req.file ? req.file.filename : null;
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (!title || !author_id) {
      return res.status(400).json({ message: "title and author_id are required" });
    }

    const [users] = await pool.query("SELECT id FROM users WHERE id = ?", [author_id]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid author_id. User does not exist." });
    }

    const [existingSlugs] = await pool.query("SELECT slug FROM blogs WHERE slug LIKE ?", [`${slug}%`]);
    if (existingSlugs.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const [results] = await pool.query(
      `INSERT INTO blogs(title, slug, content, author_id, category_id, featured_image, is_published) VALUES(?,?,?,?,?,?,?) `,
      [title, slug, content, author_id, category_id || null, featured_image, is_published],
    );

    const blogId = results.insertId;

    if (tags && tags.length) {
      let tagArray = Array.isArray(tags) ? tags : JSON.parse(tags);
      
      const [existingTags] = await pool.query(
        `SELECT id FROM tags WHERE id IN (${tagArray.map(() => '?').join(',')})`,
        tagArray
      );
      
      if (existingTags.length !== tagArray.length) {
        return res.status(400).json({ message: "One or more tag IDs do not exist" });
      }
      
      const values = tagArray.map((tagId) => [blogId, tagId]);
      await pool.query("INSERT INTO blog_tags (blog_id, tag_id) VALUES ?", [
        values,
      ]);
    }

    res.status(201).json({ message: "Blog created", id: blogId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating blog" });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 6, category, tags, search } = req.query;
    const { offset } = getPagination(page, limit);

    let whereConditions = [];
    let params = [];
    let joins = ' LEFT JOIN blog_categories bc ON b.category_id = bc.id LEFT JOIN users u ON b.author_id = u.id';

    // Don't filter by is_published for admin
    if (req.query.admin !== 'true') {
      whereConditions.push('b.is_published = 1');
    }

    if (category) {
      whereConditions.push('bc.slug = ?');
      params.push(category);
    }

    if (tags) {
      const tagArray = tags.split(',');
      joins += ' LEFT JOIN blog_tags bt ON b.id = bt.blog_id LEFT JOIN tags t ON bt.tag_id = t.id';
      whereConditions.push(`t.slug IN (${tagArray.map(() => '?').join(',')})`);
      params.push(...tagArray);
    }

    if (search) {
      whereConditions.push('(b.title LIKE ? OR b.content LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const [blogs] = await pool.query(
      `SELECT DISTINCT b.*, bc.name as category_name, bc.slug as category_slug, bc.id as category_id, u.name as author_name
       FROM blogs b
       ${joins}
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset],
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(DISTINCT b.id) AS total FROM blogs b ${joins} ${whereClause}`,
      params
    );

    for (let blog of blogs) {
      const [blogTags] = await pool.query(
        `SELECT t.id, t.name, t.slug FROM tags t
         JOIN blog_tags bt ON bt.tag_id = t.id
         WHERE bt.blog_id = ?`,
        [blog.id]
      );
      blog.tags = blogTags;
    }

    res.json({
      data: blogs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const [blogs] = await pool.query(
      `SELECT b.*, bc.name as category_name, bc.slug as category_slug, u.name as author_name
       FROM blogs b
       LEFT JOIN blog_categories bc ON b.category_id = bc.id
       LEFT JOIN users u ON b.author_id = u.id
       WHERE b.id = ? OR b.slug = ?`,
      [id, id]
    );

    if (blogs.length === 0) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    const blog = blogs[0];

    const [tags] = await pool.query(
      `SELECT t.id, t.name, t.slug FROM tags t
       JOIN blog_tags bt ON bt.tag_id = t.id
       WHERE bt.blog_id = ?`,
      [blog.id],
    );

    const [images] = await pool.query(
      `SELECT image_path FROM blog_images WHERE blog_id = ? ORDER BY display_order`,
      [blog.id]
    );

    blog.tags = tags;
    blog.images = images.map(img => img.image_path);
    return res.json(blog);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Getting Blog By Id" });
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, author_id, category_id, tags, is_published } = req.body;
  const featured_image = req.file ? req.file.filename : null;

  try {
    const [currentBlog] = await pool.query("SELECT * FROM blogs WHERE id = ?", [id]);
    if (currentBlog.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let query = "UPDATE blogs SET";
    let params = [];
    let updates = [];

    if (title) {
      let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const [existingSlugs] = await pool.query(
        "SELECT slug FROM blogs WHERE slug LIKE ? AND id != ?", 
        [`${slug}%`, id]
      );
      if (existingSlugs.length > 0) {
        slug = `${slug}-${Date.now()}`;
      }
      
      updates.push("title = ?", "slug = ?");
      params.push(title, slug);
    }

    if (content !== undefined) {
      updates.push("content = ?");
      params.push(content);
    }

    if (author_id !== undefined) {
      updates.push("author_id = ?");
      params.push(author_id);
    }

    if (category_id !== undefined) {
      updates.push("category_id = ?");
      params.push(category_id || null);
    }

    if (featured_image) {
      updates.push("featured_image = ?");
      params.push(featured_image);
    }

    if (is_published !== undefined) {
      updates.push("is_published = ?");
      params.push(is_published);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    query += " " + updates.join(", ") + " WHERE id = ?";
    params.push(id);

    await pool.query(query, params);

    if (tags) {
      await pool.query("DELETE FROM blog_tags WHERE blog_id=?", [id]);
      if (tags.length > 0) {
        let tagArray = Array.isArray(tags) ? tags : JSON.parse(tags);
        const values = tagArray.map((tagId) => [id, tagId]);
        await pool.query("INSERT INTO blog_tags (blog_id, tag_id) VALUES ?", [
          values,
        ]);
      }
    }

    return res.json({ message: "Blog updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating blog" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM blog_tags WHERE blog_id=?", [id]);
    await pool.query("DELETE FROM blogs WHERE id=?", [id]);

    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting blog" });
  }
};
