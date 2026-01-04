import jwt from "jsonwebtoken";

function extractToken(req) {
  const header = req.headers?.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }

  // Fallback: cookie-based token (already used in authController)
  if (req.cookies?.token) return req.cookies.token;

  return null;
}

export function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: missing token" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "Server misconfigured: JWT_SECRET" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      role: payload.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: invalid token" });
  }
}
