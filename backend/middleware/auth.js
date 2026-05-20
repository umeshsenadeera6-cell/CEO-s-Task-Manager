// JWT Authentication & Role Authorization Middleware
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "diwya_spices_secret_jwt_key_2026";

/**
 * Middleware: Verifies the integrity of the JWT sent in headers
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Access Denied: Digital authentication token missing." });
  }

  try {
    const verifiedUser = jwt.verify(token, JWT_SECRET);
    req.user = verifiedUser; // Attach verified credentials payload to request object
    next();
  } catch (error) {
    res.status(403).json({ error: "Access Forbidden: Digital authentication token is invalid or expired." });
  }
};

/**
 * Middleware: Enforces role-based permissions
 * @param {Array} roles - Allowed roles (e.g. ['CEO', 'Manager'])
 */
const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Access Denied: User session context not verified." });
    }

    const { role } = req.user;
    if (!roles.includes(role)) {
      return res.status(403).json({
        error: `Access Denied: Your profile role '${role}' does not possess sufficient privileges to perform this action.`
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
