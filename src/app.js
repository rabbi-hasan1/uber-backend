import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./routes/user.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hellow world");
});
app.use("/api/auth", router);
export default app;
