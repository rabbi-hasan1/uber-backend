import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/user.routes.js";
import captainRoutes from "./routes/captain.route.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hellow world");
});
app.use("/api/auth", userRouter);
app.use("/api/captains", captainRoutes);
export default app;
