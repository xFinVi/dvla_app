import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";

function VehicleCard({
  vehicle,
  getCarImage,
  removeVehicle,
  selectVehicle,
  isSelected,
}) {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/car/${vehicle.registrationNumber}`);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`overflow-hidden transition-all transform bg-white border ${
        isSelected ? "border-blue-500" : "border-gray-200"
      } shadow-lg rounded-xl`}
    >
      <img
        src={getCarImage(vehicle.make)}
        alt={`${vehicle.registrationNumber} vehicle`}
        className="object-cover w-full h-40 bg-transparent"
        loading="lazy"
        onClick={handleImageClick}
      />

      <div className="flex items-center justify-between px-3 py-1">
        <div className="">
          <h3 className="text-base font-semibold text-gray-800">
            {vehicle.registrationNumber}
          </h3>
          <div className="flex gap-3 sm:flex-col ">
            <p className="text-sm text-gray-600">
              <strong>Make: </strong> {vehicle.make || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Colour:</strong> {vehicle.colour || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Year: </strong>
              {vehicle.yearOfManufacture || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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
            <FaTrashAlt className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          console.log(
            `[${new Date().toISOString()}] Selecting vehicle ID:`,
            vehicle.id
          );
          selectVehicle(vehicle);
        }}
        className={`px-3 w-full py-1 text-gray-800   ${
          isSelected
            ? "bg-red-400 text-gray-500  font-bold"
            : "bg-yellow-400 font-medium hover:bg-yellow-200"
        }`}
        aria-label="Select vehicle"
      >
        {isSelected ? "Deselect" : "Select"}
      </motion.button>
    </motion.div>
  );
}

export default VehicleCard;
