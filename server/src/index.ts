import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import profileRouter from "./routes/profile.js";
import planRouter from "./routes/plan.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is live..."));

// API Routes
app.use("/api/profile", profileRouter);
app.use("/api/plan", planRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
