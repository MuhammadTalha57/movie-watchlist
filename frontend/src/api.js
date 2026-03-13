const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedEnvUrl = envApiUrl ? envApiUrl.replace(/\/+$/, "") : "";

const API_BASE_URL =
    normalizedEnvUrl || (import.meta.env.DEV ? "http://localhost:5000" : "");

const buildHeaders = (token, hasJsonBody = true) => {
    const headers = {};

    if (hasJsonBody) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

export const apiRequest = async (path, options = {}, token) => {
    if (!API_BASE_URL) {
        throw new Error("VITE_API_URL is missing in production environment");
    }

    const hasBody = options.body !== undefined;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...buildHeaders(token, hasBody),
            ...(options.headers || {}),
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        const message = payload?.message || "Request failed";
        throw new Error(message);
    }

    return payload;
};
