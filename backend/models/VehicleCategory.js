import BaseModel from "./BaseModel.js";

class VehicleCategory extends BaseModel {
  constructor() {
    super("vehicle_categories");
  }

  async getActiveCategories() {
    return await this.findAll({ is_active: true });
  }
}

export default new VehicleCategory();
