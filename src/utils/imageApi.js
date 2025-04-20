import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// In-memory cache for image URLs
const imageCache = new Map();

export const fetchCarImage = async (make, color) => {
  // Normalize make: trim, uppercase, check validity
  const normalizedMake = make?.trim()?.toUpperCase();
  const normalizedColor = color?.trim()?.toLowerCase();

  if (!normalizedMake || normalizedMake === "UNKNOWN") {
    return "/images/default-car.jpg"; // Silently return default
  }
  if (!ACCESS_KEY) {
    console.error("Missing VITE_UNSPLASH_ACCESS_KEY. Please set it in .env");
    return "/images/default-car.jpg";
  }

  // Create cache key based on make and color (if provided)
  const cacheKey = normalizedColor
    ? `${normalizedMake}_${normalizedColor.toUpperCase()}`
    : normalizedMake;

  // Check cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  // Query attempts: try make+color+car, make+car, make
  const queries = [];
  if (normalizedColor && normalizedColor !== "unknown") {
    queries.push(`${normalizedMake} ${normalizedColor} car`);
  }
  queries.push(`${normalizedMake} car`, normalizedMake);

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
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 429) {
        console.warn("Unsplash rate limit reached. Using default image.");
        imageCache.set(cacheKey, "/images/default-car.jpg");
        return "/images/default-car.jpg";
      }
      if (status === 401) {
        console.error(
          "Invalid Unsplash API key. Please check VITE_UNSPLASH_ACCESS_KEY."
        );
        imageCache.set(cacheKey, "/images/default-car.jpg");
        return "/images/default-car.jpg";
      }
      // Silently handle other errors (e.g., no results)
    }
  }

  // Fallback if no queries succeed
  imageCache.set(cacheKey, "/images/default-car.jpg");
  return "/images/default-car.jpg";
};
