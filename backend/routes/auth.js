import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({ name, email, password: hash, role });
  res.json({ id: u._id });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(401).json({ msg: "invalid" });
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(401).json({ msg: "invalid" });
  const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

export default router;
