const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find user directly from User collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = {
      userId: user._id,
      role: user.role, // 👈 directly from DB
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
