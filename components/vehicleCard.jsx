import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";

function VehicleCard({ vehicle, getCarImage, removeVehicle }) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 border border-gray-200 cursor-pointer"
      onClick={() => {
        console.log(
          `[${new Date().toISOString()}] Navigating to /car/${
            vehicle.registrationNumber
          }`
        );
        navigate(`/car/${vehicle.registrationNumber}`);
      }}
    >
      <img
        src={getCarImage(vehicle.make)}
        alt={`${vehicle.registrationNumber} vehicle`}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="flex justify-between items-center p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {vehicle.registrationNumber}
          </h3>
          <p className="text-sm text-gray-600">Make: {vehicle.make || "N/A"}</p>
          <p className="text-sm text-gray-600">
            Colour: {vehicle.colour || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            Year: {vehicle.yearOfManufacture || "N/A"}
          </p>
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              console.log(
                `[${new Date().toISOString()}] Removing vehicle ID:`,
                vehicle.id
              );
              removeVehicle(vehicle.id);
            }}
            className="text-red-500 hover:text-red-600"
            aria-label="Remove vehicle"
          >
            <FaTrashAlt className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default VehicleCard;
