import BaseModel from "./BaseModel.js";

class Service extends BaseModel {
  constructor() {
    super("services");
  }

  async getServicePricing(serviceId, vehicleCategoryId) {
    return await this.callProcedure("sp_get_service_pricing", [
      serviceId,
      vehicleCategoryId,
    ]);
  }

  async getServicesWithPricing() {
    const [rows] = await this.pool.query(
      `SELECT s.* FROM services s WHERE s.is_active = TRUE ORDER BY s.id`
    );
    return rows;
  }

  async getServicesByWashType(washTypeId) {
    const [rows] = await this.pool.query(
      `SELECT * FROM services WHERE wash_type_id = ? AND is_active = TRUE`,
      [washTypeId]
    );
    return rows;
  }
}

export default new Service();
