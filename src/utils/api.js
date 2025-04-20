import axios from "axios";
import axiosRetry from "axios-retry";

const vehicleCache = new Map();

const client = axios.create({
  baseURL: "http://localhost:3001/api/",
});

// Retry for 429 (rate limit) and 503 (service unavailable)
axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) =>
    error.response?.status === 429 || error.response?.status === 503,
});

/**
 * Fetches vehicle details from the DVLA API.
 * @param {string} registrationNumber - The vehicle registration number (e.g., "ABC123").
 * @returns {Promise<object>} Vehicle data or an error object.
 */
const fetchVehicleDetails = async (registrationNumber) => {
  try {
    const normalizedReg = registrationNumber.replace(/\s+/g, "").toUpperCase();
    if (!normalizedReg) {
      throw new Error("Registration number is required");
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

    if (status === 400 || status === 404 || status === 429) {
      return { error: message, status }; // Return error object for client handling
    }

    console.error(`DVLA API error for ${registrationNumber}:`, message);
    throw error; // Rethrow other errors for global handling
  }
};

export { fetchVehicleDetails };
