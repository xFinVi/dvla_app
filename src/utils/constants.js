// Default registration numbers

export const defaultRegistrations = [
  "AY18OOT",
  "V14BYE",
  "RV70JSU",
  "RJ66WFN",
  "KP13FMA",
];

export const ERROR_MESSAGES = {
  EMPTY_REG: "Please enter a registration number.",
  INVALID_REG: "Vehicle not found. Please check the registration number.",
  DUPLICATE_REG: "Vehicle with this registration number already exists.",
  INVALID_DATA: "Invalid vehicle data returned.",
  API_ERROR: "Failed to fetch vehicle data. Try again later.",
  RATE_LIMIT: "DVLA API rate limit exceeded.",
};

export const API_URLS = {
  DVLA: "http://localhost:3001/api/vehicles",
};
