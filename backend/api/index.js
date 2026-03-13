import "dotenv/config";
import app from "../src/app.js";
import { connectToDatabase } from "../src/config/db.js";

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        return app(req, res);
    } catch (error) {
        console.error("Vercel handler error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
}
