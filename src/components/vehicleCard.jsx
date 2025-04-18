import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";

function VehicleCard({ vehicle, getCarImage, removeVehicle }) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="overflow-hidden transition-all transform bg-white border border-gray-200 shadow-lg cursor-pointer rounded-xl hover:scale-105"
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
        className="object-cover w-full h-40"
        loading="lazy"
      />
      <div className="flex items-center justify-between p-4">
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
