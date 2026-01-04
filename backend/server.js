import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// demo route
app.get("/", (req, res) => {
  res.send("Server running just fine!");
});

// root Endpoints
app.use("/api/v1/auth", authRouter);

// Start server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} ----------->`)
);
