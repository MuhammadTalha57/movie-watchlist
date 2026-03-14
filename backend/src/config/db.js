import dns from "node:dns";
import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;
mongoose.set("bufferCommands", false);

const globalCache = globalThis;
if (!globalCache.mongooseCache) {
    globalCache.mongooseCache = {
        conn: null,
        promise: null,
        dnsConfigured: false,
    };
}

const cache = globalCache.mongooseCache;

const isConnectionReady = () => mongoose.connection.readyState === 1;

const configureDnsForSrv = () => {
    if (cache.dnsConfigured || !DATABASE_URL?.startsWith("mongodb+srv://")) {
        return;
    }

    const dnsServers = process.env.DNS_SERVERS?.split(",") || [
        "8.8.8.8",
        "1.1.1.1",
    ];
    dns.setServers(dnsServers.map((server) => server.trim()));
    cache.dnsConfigured = true;
};

export const connectToDatabase = async () => {
    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL is missing in environment variables");
    }

    if (isConnectionReady()) {
        cache.conn = mongoose.connection;
        return cache.conn;
    }

    if (cache.conn && !isConnectionReady()) {
        cache.conn = null;
    }

    configureDnsForSrv();

    if (!cache.promise) {
        cache.promise = mongoose.connect(DATABASE_URL, {
            serverApi: {
                version: "1",
                strict: true,
                deprecationErrors: true,
            },
            family: 4,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });
    }

    try {
        await cache.promise;
        cache.conn = mongoose.connection;
        return cache.conn;
    } catch (error) {
        cache.promise = null;
        throw error;
    } finally {
        cache.promise = null;
    }
};
