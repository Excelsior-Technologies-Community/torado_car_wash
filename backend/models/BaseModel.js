import pool from "../config/db.js";

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  async findAll(conditions = {}, limit = null, offset = 0) {
    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key) => {
          params.push(conditions[key]);
          return `${key} = ?`;
        })
        .join(" AND ");
      query += ` WHERE ${whereClause}`;
    }

    if (limit) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    const [rows] = await this.pool.query(query, params);
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => "?").join(", ");

    const [result] = await this.pool.query(
      `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders})`,
      values
    );
    return result.insertId;
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    await this.pool.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await this.pool.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    return true;
  }

  async softDelete(id) {
    await this.pool.query(
      `UPDATE ${this.tableName} SET is_active = FALSE WHERE id = ?`,
      [id]
    );
    return true;
  }

  async callProcedure(procedureName, params = []) {
    const placeholders = params.map(() => "?").join(", ");
    const [rows] = await this.pool.query(
      `CALL ${procedureName}(${placeholders})`,
      params
    );
    return rows[0];
  }
}

export default BaseModel;
