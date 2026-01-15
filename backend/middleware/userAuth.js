import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    // 1️⃣ Read token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in.",
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Backward-compatible userId extraction
    const userId = decoded?.id || decoded?.userId || decoded?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // 4️⃣ Attach user to request
    req.user = { id: userId };

    next();
  } catch (error) {
    // 5️⃣ Token expired / invalid
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token.",
    });
  }
};

export default userAuth;
