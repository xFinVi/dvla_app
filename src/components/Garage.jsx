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
import { defaultBackground, defaultRegistrations } from "../utils/constants.js";
import { Link } from "react-router-dom";

function Garage() {
  const [vehicles, setVehicles] = useState(getInitialVehicles());
  const [imageCache, setImageCache] = useState(getInitialImageCache());
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // Initialize default vehicles if needed
  useEffect(() => {
    const initializeDefaultVehicles = async () => {
      // If there are no vehicles loaded, seed defaults
      if (vehicles.length === 0) {
        const newVehicles = [];
        const newImageCache = { ...imageCache };

        for (const regNumber of defaultRegistrations) {
          try {
            const result = await fetchVehicleDetails(
              regNumber.trim().toUpperCase()
            );

            if (result?.make && result?.registrationNumber) {
              const id = `${regNumber}-${Date.now()}-${Math.random()}`;

              newVehicles.push({
                id,
                registrationNumber: result.registrationNumber.toUpperCase(),
                make: result.make,
                colour: result.colour || "N/A",
                yearOfManufacture: result.yearOfManufacture || "N/A",
              });

              // Add image if not already cached
              if (result.make && !newImageCache[result.make]) {
                const imageUrl = await fetchCarImage(
                  result.make,
                  result.colour
                );
                newImageCache[result.make] = imageUrl;
              }
            }
          } catch (err) {
            console.error(`Error fetching vehicle ${regNumber}:`, err);
          }
        }

        // Only update state if we actually got valid vehicles
        if (newVehicles.length > 0) {
          setVehicles(newVehicles);
          setImageCache(newImageCache);

          // Save to localStorage
          localStorage.setItem("vehicles", JSON.stringify(newVehicles));
          localStorage.setItem("imageCache", JSON.stringify(newImageCache));
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
      console.error("Error saving to localStorage:", err);
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
        const imageUrl = await fetchCarImage(result.make, result.colour);
        setImageCache((prev) => ({ ...prev, [result.make]: imageUrl }));
      }

      setError(null);
    } catch (error) {
      setError("Failed to add vehicle.");
      console.error("Error adding vehicle:", error.message);
    }
  };

  const removeVehicle = (id) => {
    // Find the vehicle to get its make before removing
    const vehicleToRemove = vehicles.find((vehicle) => vehicle.id === id);
    if (!vehicleToRemove) return;

    // Remove the vehicle
    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
    setVehicles(updatedVehicles);

    // Check if any remaining vehicles have the same make
    const hasSameMake = updatedVehicles.some(
      (vehicle) => vehicle.make === vehicleToRemove.make
    );

    // If no vehicles share the make, remove it from imageCache
    if (!hasSameMake) {
      setImageCache((prev) => {
        const newCache = { ...prev };
        delete newCache[vehicleToRemove.make];
        return newCache;
      });
    }

    setDeleteMessage("Car deleted");
    setTimeout(() => setDeleteMessage(null), 3000);

    // If the deleted vehicle was selected, clear selection
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar(null);
    }
  };

  const selectVehicle = (vehicle) => {
    setSelectedCar(
      selectedCar && selectedCar.id === vehicle.id ? null : vehicle
    );
  };

  const getCarImage = (make) => imageCache[make] || "/images/default-car.jpg";

  const sortedVehicles = useMemo(() => {
    if (!sortOrder) return vehicles;

    return [...vehicles].sort((a, b) => {
      const yearA = a.yearOfManufacture;
      const yearB = b.yearOfManufacture;

      if (yearA === "N/A" || !yearA) return 1;
      if (yearB === "N/A" || !yearB) return -1;

      return sortOrder === "asc"
        ? Number(yearA) - Number(yearB)
        : Number(yearB) - Number(yearA);
    });
  }, [vehicles, sortOrder]);

  const randomIndex = Math.floor(Math.random() * defaultBackground.length);

  const backgroundImage = `url(${defaultBackground[randomIndex]} `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative w-full h-[60vh] ${
          vehicles.length > 0 ? "lg:h-[40vh]" : "lg:h-[70vh]"
        } bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: !selectedCar
            ? backgroundImage
            : `url(${getCarImage(selectedCar.make)})`,
        }}
      >
        {selectedCar && (
          <Link
            to={`/car/${selectedCar.registrationNumber}`}
            className="absolute z-50 bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] text-center flex items-center justify-center h-10 px-2 text-white bg-yellow-400 rounded-lg cursor-pointer"
            aria-label="View selected car details"
          >
            View car
          </Link>
        )}
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
            <div className="flex items-center justify-center w-2/4 gap-6 mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="text-center flex justify-center items-center font-bold text-gray-700 bg-yellow-500 max-w-[350px] px-4 text-lg rounded-lg py-2"
              >
                You have {vehicles.length} vehicles.
              </motion.h2>
              {vehicles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center mt-4"
                >
                  <select
                    value={sortOrder || ""}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-24 px-2 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Sort vehicles by year"
                  >
                    <option value="none">No Sort</option>
                    <option value="asc">Oldest First</option>
                    <option value="desc">Newest First</option>
                  </select>
                </motion.div>
              )}
            </div>

          <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[90%] xl:max-w-[1350px] w-full mx-auto mt-8"
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
                {sortedVehicles.map((vehicle) => (
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
