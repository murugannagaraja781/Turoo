import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  const header = req.headers.authorization?.split(" ")[1];
  if (!header) return res.status(401).json({ msg: "no token" });
  try {
    req.user = jwt.verify(header, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ msg: "invalid token" });
  }
};

export const permit =
  (...allowed) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "no user" });
    if (allowed.includes(req.user.role)) return next();
    return res.status(403).json({ msg: "forbidden" });
  };
