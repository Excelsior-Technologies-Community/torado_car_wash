const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const allowedRoles = ['admin', 'super_admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default adminMiddleware;
