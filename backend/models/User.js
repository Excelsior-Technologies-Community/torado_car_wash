import BaseModel from "./BaseModel.js";

class User extends BaseModel {
  constructor() {
    super("users");
  }

  async findByEmail(email) {
    const [rows] = await this.pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  async getUserWithRole(userId) {
    const [rows] = await this.pool.query(
      `SELECT u.*, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );
    return rows[0];
  }

  async createUser(userData) {
    const { name, email, phone, password_hash, role_id } = userData;
    const [result] = await this.pool.query(
      "INSERT INTO users (name, email, phone, password_hash, role_id) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, password_hash, role_id]
    );
    return result.insertId;
  }
}

export default new User();
