import express from "express";

import {
    createMovie,
    deleteMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
} from "../controllers/movie.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
