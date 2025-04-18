import axios from "axios";

// In-memory cache for DVLA responses
const vehicleCache = new Map();

export const fetchVehicleDetails = async (registrationNumber) => {
  try {
    // Normalize registration: remove spaces, uppercase
    const normalizedReg = registrationNumber.replace(/\s+/g, "").toUpperCase();
    // Basic client-side check
    if (!normalizedReg) {
      return null; // Silently return null for empty input
    }

    // Check cache first
    if (vehicleCache.has(normalizedReg)) {
      return vehicleCache.get(normalizedReg);
    }

    const response = await axios.post("http://localhost:3001/api/vehicles", {
      registrationNumber: normalizedReg,
    });

    const data = response.data;
    vehicleCache.set(normalizedReg, data);
    return data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    if (status === 400 || status === 404) {
      vehicleCache.set(normalizedReg, null); // Cache failures
      return { error: message, status }; // Return error for AddForm.jsx
    }
    if (status === 429) {
      console.error("DVLA API rate limit exceeded.");
      return { error: message, status };
    }

    // Handle "Invalid URL" or other network errors
    console.error(`DVLA API error for ${normalizedReg}:`, message);
    return { error: message, status: status || "network" }; // Return error object instead of throwing
  }
};
