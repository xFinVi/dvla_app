import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// In-memory cache for image URLs
const imageCache = new Map();

export const fetchCarImage = async (make) => {
  // Normalize make: trim, uppercase, check validity
  const normalizedMake = make?.trim()?.toUpperCase();
  if (!normalizedMake || normalizedMake === "UNKNOWN") {
    return "/images/default-car.jpg"; // Silently return default
  }
  if (!ACCESS_KEY) {
    console.error("Missing VITE_UNSPLASH_ACCESS_KEY. Please set it in .env");
    return "/images/default-car.jpg";
  }

  // Check cache first
  if (imageCache.has(normalizedMake)) {
    return imageCache.get(normalizedMake);
  }

  // Query attempts: try "BMW car", then "BMW"
  const queries = [`${normalizedMake} car`, normalizedMake];

  for (const query of queries) {
    try {
      const response = await axios.get(UNSPLASH_API_URL, {
        params: {
          query,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      });

      const imageUrl = response.data.results[0]?.urls?.regular;
      if (imageUrl) {
        imageCache.set(normalizedMake, imageUrl);
        return imageUrl;
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 429) {
        console.warn("Unsplash rate limit reached. Using default image.");
        imageCache.set(normalizedMake, "/images/default-car.jpg");
        return "/images/default-car.jpg";
      }
      if (status === 401) {
        console.error(
          "Invalid Unsplash API key. Please check VITE_UNSPLASH_ACCESS_KEY."
        );
        imageCache.set(normalizedMake, "/images/default-car.jpg");
        return "/images/default-car.jpg";
      }
      // Silently handle other errors (e.g., no results)
    }
  }

  // Fallback if no queries succeed
  imageCache.set(normalizedMake, "/images/default-car.jpg");
  return "/images/default-car.jpg";
};
