import { connectToDatabase } from "../config/db.js";

export const ensureDatabaseConnection = async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error("Database middleware error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
};
