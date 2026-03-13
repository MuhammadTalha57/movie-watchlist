import "dotenv/config";
import app from "./app.js";
import { connectToDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
    await connectToDatabase();
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
