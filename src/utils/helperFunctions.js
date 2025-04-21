// Initialize vehicles from localStorage
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
// Initialize imagese from localStorage
export const getInitialImageCache = () => {
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

// Format strings (DIESEL to Diesel)
export const formatString = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "N/A";

// Format dates ( 2025-10-01  01 Oct 2025)
export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(date, "dd MMM yyyy");
  } catch {
    return dateStr;
  }
};

export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};
export const setLocalStorage = (key, value = null) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};
