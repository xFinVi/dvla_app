import axios from "axios";
import axiosRetry from "axios-retry";
import { getLocalStorage } from "./helperFunctions";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => error.response?.status === 429,
});

const fetchVehicleDetails = async (registrationNumber) => {
  //check local storage before making another api call
  const vehicles = getLocalStorage("vehicles") || [];
  const cachedVehicle = vehicles.find(
    (vehicle) => vehicle.registrationNumber.toUpperCase() === registrationNumber
  );
  // if the vehicle is found in storage, return it
  if (cachedVehicle) return cachedVehicle;

  //else make the api call
  try {
    const response = await client.post("/vehicles", {
      registrationNumber: registrationNumber,
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.error || "Unable to connect to the backend.";
    return { error: message, status: status || "network" };
  }
};

export { fetchVehicleDetails };
