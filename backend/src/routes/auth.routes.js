import express from "express";

import {
    authenticateUser,
    registerUser,
} from "../controllers/auth.controller.js";
import { ensureDatabaseConnection } from "../middlewares/db.middleware.js";

const router = express.Router();

router.use(ensureDatabaseConnection);

router.post("/register", registerUser);

router.post("/login", authenticateUser);

export default router;
