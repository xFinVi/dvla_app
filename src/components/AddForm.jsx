import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { fetchVehicleDetails } from "../utils/api.js";

function AddForm({ onAddVehicle }) {
  const [newRegPlate, setNewRegPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Client-side validation
  const validateRegPlate = (regPlate) => {
    if (!regPlate.trim()) {
      return "Registration number is required.";
    }
    if (regPlate.length < 2 || regPlate.length > 7) {
      return "Registration number must be 2 to 7 characters long.";
    }
    if (!/^[A-Z0-9]+$/.test(regPlate)) {
      return "Registration number must contain only letters and numbers.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const regPlate = newRegPlate.trim().toUpperCase();

    // Client-side validation
    const validationError = validateRegPlate(regPlate);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const details = await fetchVehicleDetails(regPlate);
      if (details && details.make && details.registrationNumber) {
        onAddVehicle({ id: Date.now(), ...details });
        setNewRegPlate("");
      } else {
        setError("Invalid vehicle data returned from API.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch vehicle data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="flex justify-center gap-4 mb-8 sm:flex-row"
      role="form"
      aria-labelledby="add-vehicle-form"
    >
      <div className="flex flex-col w-full sm:w-64">
        <label htmlFor="regPlate" className="sr-only">
          Registration Number
        </label>
        <input
          id="regPlate"
          type="text"
          value={newRegPlate}
          onChange={(e) => setNewRegPlate(e.target.value.toUpperCase())}
          placeholder="Enter registration number (e.g., AK13BBX)"
          className={`w-full p-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? "regPlate-error" : undefined}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            id="regPlate-error"
            className="p-2 mt-2 text-sm text-red-600 bg-red-100 rounded-md"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center h-12 gap-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        aria-busy={isLoading}
      >
        <FaPlus /> {isLoading ? "Adding..." : "Add Vehicle"}
      </motion.button>
    </motion.form>
  );
}

export default AddForm;
