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

    const rawDnsServers = process.env.DNS_SERVERS?.trim();

    if (!rawDnsServers) {
        cache.dnsConfigured = true;
        return;
    }

    const dnsServers = rawDnsServers
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (dnsServers.length > 0) {
        dns.setServers(dnsServers);
    }

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

    if (cache.promise) {
        await cache.promise;
        cache.conn = mongoose.connection;
        return cache.conn;
    }

    // configureDnsForSrv();

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

    try {
        await cache.promise;
        cache.conn = mongoose.connection;
        return cache.conn;
    } catch (error) {
        cache.conn = null;
        throw error;
    } finally {
        cache.promise = null;
    }
};
