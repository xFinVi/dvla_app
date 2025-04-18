// Initialize vehicles from localStorage synchronously
export const getInitialVehicles = () => {
  try {
    const storedVehicles = localStorage.getItem("vehicles");

    if (storedVehicles) {
      const parsedVehicles = JSON.parse(storedVehicles);
      if (Array.isArray(parsedVehicles)) {
        return parsedVehicles;
      }

      localStorage.removeItem("vehicles");
    } else {
    }
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error parsing initial vehicles:`,
      err
    );
    localStorage.removeItem("vehicles");
  }
  return [];
};

export // Initialize imageCache from localStorage synchronously
const getInitialImageCache = () => {
  try {
    const storedImageCache = localStorage.getItem("imageCache");
    if (storedImageCache) {
      const parsedImageCache = JSON.parse(storedImageCache);
      if (parsedImageCache && typeof parsedImageCache === "object") {
        return parsedImageCache;
      }
      localStorage.removeItem("imageCache");
    }
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error parsing initial imageCache:`,
      err
    );
    localStorage.removeItem("imageCache");
  }
  return {};
};
