import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import croses from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(croses({ allowOrigin: true }));
// app.use("/",`` (req, res) => res.send("API Running"));
app.use("/", (req, res) => res.send("API Running"));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5500;
await mongoose.connect(process.env.MONGO_URI);
console.log("Mongo connected", process.env.MONGO_URI);
app.listen(PORT, () => console.log("Server up", PORT));
