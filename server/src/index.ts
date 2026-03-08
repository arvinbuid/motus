import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import profileRouter from "./routes/profile.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/profile", profileRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
