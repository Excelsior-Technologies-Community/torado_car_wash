export const getPagination = (page = 1, limit = 6) => {
  const offset = (page - 1) * limit;
  return { limit: Number(limit), offset };
};
