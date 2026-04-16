import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import {requireAuth} from "./middleware/auth.js";
import profileRouter from "./routes/profile.js";
import planRouter from "./routes/plan.js";
import {rateLimit} from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: "Too many requests, please try again later.",
});

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(limiter);
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Server is live..."));

// API Routes
app.use("/api/profile", requireAuth, profileRouter);
app.use("/api/plan", requireAuth, planRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
