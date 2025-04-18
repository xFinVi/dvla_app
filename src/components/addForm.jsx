import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { fetchVehicleDetails } from "../utils/api";

function AddForm({ onAddVehicle }) {
  const [newRegPlate, setNewRegPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* submit function */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRegPlate.trim()) {
      setError("Please enter a registration number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const details = await fetchVehicleDetails(newRegPlate.trim());
      if (details && details.make && details.registrationNumber) {
        onAddVehicle({ id: Date.now(), ...details }); // Use timestamp for unique ID
        setNewRegPlate("");
      } else {
        setError("Invalid vehicle data returned.");
      }
    } catch (error) {
      if (error.message.includes("404")) {
        setError("Vehicle not found. Please check the registration number.");
      } else {
        setError("Failed to fetch vehicle data. Try again later.");
      }
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
    >
      <div className="flex flex-col w-full sm:w-64">
        <input
          type="text"
          value={newRegPlate}
          onChange={(e) => setNewRegPlate(e.target.value)}
          placeholder="Enter registration number (e.g., AK13BBX)"
          className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        {/* error div */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
      {/* submit button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center h-12 gap-2 px-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
      >
        <FaPlus /> {isLoading ? "Adding..." : "Add Vehicle"}
      </motion.button>
    </motion.form>
  );
}

export default AddForm;
