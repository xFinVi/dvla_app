import axios from "axios";
import axiosRetry from "axios-retry";

const vehicleCache = new Map();

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Fallback for local testing
});

// Retry for 429 (rate limit) and 503 (service unavailable)
axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) =>
    error.response?.status === 429 || error.response?.status === 503,
});

const fetchVehicleDetails = async (registrationNumber) => {
  try {
    const normalizedReg = registrationNumber.replace(/\s+/g, "").toUpperCase();
    if (!normalizedReg) {
      return { error: "Registration number is required", status: 400 };
    }

    if (vehicleCache.has(normalizedReg)) {
      return vehicleCache.get(normalizedReg);
    }

    const response = await client.post("vehicles", {
      registrationNumber: normalizedReg,
    });

    const data = response.data;
    vehicleCache.set(normalizedReg, data);
    return data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    console.error(
      `[${new Date().toISOString()}] DVLA API error for ${registrationNumber}:`,
      message
    );
    if (status === 400 || status === 404 || status === 429) {
      return { error: message, status };
    }

    // Handle network errors (e.g., backend not deployed)
    return {
      error: "Unable to connect to the backend. Please try again later.",
      status: "network",
    };
  }
};

export { fetchVehicleDetails };
