import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVehicleDetails } from "../utils/api";
import { fetchCarImage } from "../utils/imageApi";
import AddForm from "./AddForm";
import VehicleCard from "./VehicleCard.jsx";
import {
  getInitialVehicles,
  getInitialImageCache,
} from "../utils/helperFunctions";
import { defaultRegistrations } from "../utils/constants.js";

import { Navigate, Link, useNavigate } from "react-router-dom";

function Garage() {
  const [vehicles, setVehicles] = useState(getInitialVehicles());
  const [imageCache, setImageCache] = useState(getInitialImageCache());
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();
  // Initialize default vehicles and set default selected car
  useEffect(() => {
    const initializeDefaultVehicles = async () => {
      if (vehicles.length === 0 && !localStorage.getItem("vehicles")) {
        const newVehicles = [];
        const newImageCache = { ...imageCache };

        for (const regNumber of defaultRegistrations) {
          try {
            const result = await fetchVehicleDetails(
              regNumber.trim().toUpperCase()
            );
            if (result && result.make && result.registrationNumber) {
              newVehicles.push({
                id: `${regNumber}-${Date.now()}`,
                registrationNumber: regNumber.toUpperCase(),
                make: result.make,
                colour: result.colour || "N/A",
                yearOfManufacture: result.yearOfManufacture || "N/A",
              });

              if (result.make && !newImageCache[result.make]) {
                const imageUrl = await fetchCarImage(result.make);
                newImageCache[result.make] = imageUrl;
              }
            }
          } catch (err) {
            console.error(
              `[${new Date().toISOString()}] Error fetching vehicle ${regNumber}:`,
              err
            );
          }
        }

        if (newVehicles.length > 0) {
          setVehicles(newVehicles);
          setImageCache(newImageCache);
        }
      }
    };

    initializeDefaultVehicles();
  }, []);

  // Save vehicles and imageCache to localStorage
  useMemo(() => {
    try {
      localStorage.setItem("vehicles", JSON.stringify(vehicles));
      localStorage.setItem("imageCache", JSON.stringify(imageCache));
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] Error saving to localStorage:`,
        err
      );
    }
  }, [vehicles, imageCache]);

  const handleAddVehicle = async (newVehicle) => {
    const regNumber = newVehicle.registrationNumber.trim().toUpperCase();
    const make = newVehicle.make?.trim();

    if (!make || make === "Unknown") {
      setError("Invalid vehicle make.");
      return;
    }

    if (
      vehicles.some(
        (vehicle) => vehicle.registrationNumber.toUpperCase() === regNumber
      )
    ) {
      setError("Vehicle with this registration number already exists.");
      return;
    }

    try {
      const result = await fetchVehicleDetails(regNumber);
      if (result?.error || !result?.make || !result?.registrationNumber) {
        setError("Invalid vehicle data.");
        return;
      }

      const updatedVehicle = { ...newVehicle, ...result };
      setVehicles((prev) => [...prev, updatedVehicle]);

      if (result.make && !imageCache[result.make]) {
        const imageUrl = await fetchCarImage(result.make);
        setImageCache((prev) => ({ ...prev, [result.make]: imageUrl }));
      }

      setError(null);
    } catch (error) {
      setError("Failed to add vehicle.");
      console.error(
        `[${new Date().toISOString()}] Error adding vehicle:`,
        error.message
      );
    }
  };

  const removeVehicle = (id) => {
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
    setDeleteMessage("Car deleted");
    setTimeout(() => setDeleteMessage(null), 3000);
  };

  const selectVehicle = (vehicle) => {
    // Toggle: If the vehicle is already selected, unselect it; otherwise, select it
    if (selectedCar && selectedCar.id === vehicle.id) {
      setSelectedCar(null);
    } else {
      setSelectedCar(vehicle);
    }
  };
  const getCarImage = (make) => imageCache[make] || "/images/default-car.jpg";
  const handleImageClick = () => {
    if (selectedCar) {
      navigate(`/car/${selectedCar.registrationNumber}`);
    } else {
      setError("No car selected. Please select a vehicle first.");
      setTimeout(() => setError(null), 3000);
    }
  };
  // Default background image
  const defaultBackground =
    "url('https://media.istockphoto.com/id/1481572586/photo/dark-concrete-led-white-lights-underground-tunnel-corridor-cement-asphalt-hallway-warehouse.jpg?s=2048x2048&w=is&k=20&c=xcjHk6NkZJD3ug2kKdJRd07JDlQoVB7MRXOe09Re9s4=')";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[60vh] lg:h-[40vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: !selectedCar
            ? defaultBackground
            : `url(${getCarImage(selectedCar.make)})`,
        }}
      >
        <Link
          to={`/car/${selectedCar?.registrationNumber}`}
          className={`absolute z-50 right-[40%] left-[31%] w-[150px] text-center flex items-center justify-center h-10 px-2 text-white bg-yellow-400 bottom-4 ${
            !selectedCar ? "hidden" : "flex cursor-pointer"
          }`}
        >
          View car
        </Link>
      </motion.div>

      {/* Form and Vehicles Grid */}
      <motion.div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-[90%] mx-auto">
          <AddForm onAddVehicle={handleAddVehicle} />

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 mt-2 font-semibold text-center text-red-500 bg-red-100 rounded-lg"
              >
                {error}
              </motion.p>
            )}
            {deleteMessage && (
              <motion.div
                key="delete-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-center text-white font-semibold bg-red-400 py-2 px-4 rounded-lg max-w-[200px] mx-auto"
              >
                {deleteMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {vehicles.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 text-center mt-8 text-lg max-w-[90%] mx-auto"
          >
            No vehicles in your garage. Add one to get started!
          </motion.p>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-center flex justify-center items-center font-bold text-center text-gray-700 bg-yellow-500 max-w-[350px] px-4  text-2xl sm:text-3xl lg:text-2xl rounded-lg py-2"
            >
              Your have {vehicles.length} vehicles.
            </motion.h2>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-[90%] lg:max-w-[70%] mx-auto mt-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              }}
            >
              <AnimatePresence>
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    getCarImage={getCarImage}
                    removeVehicle={removeVehicle}
                    selectVehicle={selectVehicle}
                    isSelected={selectedCar && selectedCar.id === vehicle.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Garage;
