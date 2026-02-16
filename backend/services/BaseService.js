const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

class BaseService {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  async findAll(conditions = {}, options = {}) {
    const { limit, offset, orderBy = 'id', order = 'DESC' } = options;
    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      query += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    query += ` ORDER BY ${orderBy} ${order}`;
    if (limit) query += ` LIMIT ${limit}`;
    if (offset) query += ` OFFSET ${offset}`;

    const [rows] = await this.pool.query(query, params);
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await this.pool.query(query, values);
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    await this.pool.query(query, [...values, id]);
    return this.findById(id);
  }

  async delete(id) {
    const [result] = await this.pool.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  async count(conditions = {}) {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      query += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    const [rows] = await this.pool.query(query, params);
    return rows[0].total;
  }
}

module.exports = BaseService;
