import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVehicleDetails } from "../utils/api";
import { fetchCarImage } from "../utils/imageApi";
import AddForm from "./AddForm";
import VehicleCard from "./VehicleCard.jsx";
import {
  getInitialVehicles,
  getInitialImageCache,
  setLocalStorage,
} from "../utils/helperFunctions";
import {
  containerVariants,
  defaultBackground,
  defaultRegistrations,
  itemVariants,
} from "../utils/constants.js";
import { Link } from "react-router-dom";

function Garage() {
  const [vehicles, setVehicles] = useState(getInitialVehicles());
  const [imageCache, setImageCache] = useState(getInitialImageCache());
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // Initialize default vehicles if needed
  useEffect(() => {
    const initializeDefaultVehicles = async () => {
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
                ...result,
              });

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

        if (newVehicles.length > 0) {
          setLocalStorage("vehicles", newVehicles);
          setLocalStorage("imageCache", newImageCache);
          setVehicles(newVehicles);
          setImageCache(newImageCache);
        }
      }
    };

    initializeDefaultVehicles();
  }, []);

  // Save vehicles and imageCache to localStorage
  useEffect(() => {
    setLocalStorage("vehicles", vehicles);
    setLocalStorage("imageCache", imageCache);
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
      const updatedVehicle = {
        id: `${regNumber}-${Date.now()}-${Math.random()}`,
        ...result,
      };
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
    const vehicleToRemove = vehicles.find((vehicle) => vehicle.id === id);
    if (!vehicleToRemove) return;

    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
    setVehicles(updatedVehicles);

    const hasSameMake = updatedVehicles.some(
      (vehicle) => vehicle.make === vehicleToRemove.make
    );

    if (!hasSameMake) {
      setImageCache((prev) => {
        const newCache = { ...prev };
        delete newCache[vehicleToRemove.make];
        return newCache;
      });
    }

    setDeleteMessage("Car deleted");
    setTimeout(() => setDeleteMessage(null), 3000);

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
  const backgroundImage = `url(${defaultBackground[randomIndex]})`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
          <motion.div variants={itemVariants}>
            <Link
              to={`/car/${selectedCar.registrationNumber}`}
              className="absolute z-50 bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] text-center flex items-center justify-center h-10 px-2 text-white bg-yellow-400 rounded-lg cursor-pointer"
              aria-label="View selected car details"
            >
              View car
            </Link>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center px-4 py-8"
      >
        <motion.div variants={itemVariants} className="max-w-[90%] mx-auto">
          <AddForm onAddVehicle={handleAddVehicle} />

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="px-4 py-2 mt-2 font-semibold text-center text-red-500 bg-red-100 rounded-lg"
              >
                {error}
              </motion.p>
            )}
            {deleteMessage && (
              <motion.div
                key="delete-message"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mt-2 text-center text-white font-semibold bg-red-400 py-2 px-4 rounded-lg max-w-[200px] mx-auto"
              >
                {deleteMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {vehicles.length === 0 ? (
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-gray-500 text-center mt-8 text-lg max-w-[90%] mx-auto"
          >
            No vehicles in your garage. Add one to get started!
          </motion.p>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-center w-full gap-6 mx-auto xs:w-3/4"
            >
              <motion.h2
                variants={itemVariants}
                className="text-center flex justify-center items-center font-bold text-gray-700 bg-yellow-500 max-w-[350px] px-4 text-lg rounded-lg py-2"
              >
                You have {vehicles.length} vehicles.
              </motion.h2>
              {vehicles.length > 0 && (
                <motion.div
                  variants={itemVariants}
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
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[90%] xl:max-w-[1350px] w-full mx-auto mt-8"
            >
              <AnimatePresence>
                {sortedVehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <VehicleCard
                      vehicle={vehicle}
                      getCarImage={getCarImage}
                      removeVehicle={removeVehicle}
                      selectVehicle={selectVehicle}
                      isSelected={selectedCar && selectedCar.id === vehicle.id}
                    />
                  </motion.div>
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
