import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
export default app;
