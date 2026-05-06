import jwt from "jsonwebtoken";

const accessToken = process.env.ACCESS_TOKEN_SECRET;

export const protect = (req, res, next) => {
  const token = res.cookie.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No token provide" });
  }

  try {
    const payload = jwt.verify(token, accessToken);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
