import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVehicleDetails } from "../utils/api";
import { fetchCarImage } from "../utils/imageApi";
import AddForm from "./AddForm";
import VehicleCard from "./VehicleCard.jsx";
import {
  getInitialVehicles,
  getInitialImageCache,
} from "../utils/helperFunctions";

function Garage() {
  const [vehicles, setVehicles] = useState(getInitialVehicles());
  const [imageCache, setImageCache] = useState(getInitialImageCache());
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  // Default registration numbers
  const defaultRegistrations = [
    "AY18OOT",
    "V14BYE",
    "RV70JSU",
    "RJ66WFN",
    "KP13FMA",
  ];

  // Initialize default vehicles on first load if localStorage is empty
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
  useEffect(() => {
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

  const getCarImage = (make) => imageCache[make] || "/images/default-car.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[40vh] lg:h-[45vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/roller-door-roller-shutter-using-factory-warehouse-generative-ai_91128-2383.jpg?t=st=1744964050~exp=1744967650~hmac=0115eaa8c3d0b0fd36173d9049388b70a0433987da7474a023fc4b43a157dc44&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="mt-6 text-6xl font-bold text-white sm:text-7xl"
          >
            Your Garage
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 text-xl"
            >
              {vehicles.length === 0 ? "Add vehicles to get started" : ""}
            </motion.p>
          </motion.h2>
        </div>
      </motion.div>
      <motion.div
        className="mt-8 max-w-[90%] mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <AddForm onAddVehicle={handleAddVehicle} />
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 text-red-500 font-semibold text-center bg-red-100 py-2 px-4 rounded-lg max-w-[90%] mx-auto"
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
            className="mb-6 text-center text-white font-semibold bg-red-400 py-2 px-4 rounded-lg max-w-[200px] mx-auto"
          >
            {deleteMessage}
          </motion.div>
        )}
      </AnimatePresence>
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
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-[90%] lg:max-w-[70%] mx-auto"
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
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default Garage;
