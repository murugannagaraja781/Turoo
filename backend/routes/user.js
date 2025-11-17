import express from "express";
import { auth, permit } from "../middleware/auth.js";
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  // return user id & role from token
  res.json({ user: req.user });
});

router.get("/admin-only", auth, permit("admin"), (req, res) => {
  res.json({ secret: "admin stuff" });
});

export default router;
