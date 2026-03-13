import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const MAX_RETRIES = 5;

async function startServer() {
    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL is missing in .env");
    }

    if (DATABASE_URL.startsWith("mongodb+srv://")) {
        const dnsServers = process.env.DNS_SERVERS?.split(",") || [
            "8.8.8.8",
            "1.1.1.1",
        ];
        dns.setServers(dnsServers.map((server) => server.trim()));
        console.log(`Using DNS servers: ${dns.getServers().join(", ")}`);
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
        try {
            await mongoose.connect(DATABASE_URL, {
                serverApi: {
                    version: "1",
                    strict: true,
                    deprecationErrors: true,
                },
                family: 4,
            });
            console.log("Connected to MongoDB Atlas");
            break;
        } catch (error) {
            const isLastAttempt = attempt === MAX_RETRIES;
            console.error(`MongoDB connection attempt ${attempt} failed.`);
            console.error(error.message);

            if (isLastAttempt) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
        }
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
