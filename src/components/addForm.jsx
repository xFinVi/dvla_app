import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { fetchVehicleDetails } from "../utils/api";

function AddForm({ onAddVehicle }) {
  const [newRegPlate, setNewRegPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      className="mb-8 flex flex-col sm:flex-row gap-4 justify-center"
    >
      <div className="flex flex-col w-full sm:w-64">
        <input
          type="text"
          value={newRegPlate}
          onChange={(e) => setNewRegPlate(e.target.value)}
          placeholder="Enter registration number (e.g., AK13BBX)"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          disabled={isLoading}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
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
        className="flex items-center gap-2 px-4 py-3 bg-blue-500 justify-center font-medium text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
      >
        <FaPlus /> {isLoading ? "Adding..." : "Add Vehicle"}
      </motion.button>
    </motion.form>
  );
}

export default AddForm;
