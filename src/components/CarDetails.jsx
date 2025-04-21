import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format, parse } from "date-fns";
import { fetchVehicleDetails } from "../utils/api";
import { fetchCarImage } from "../utils/imageApi";
import {
  formatDate,
  formatString,
  getLocalStorage,
} from "../utils/helperFunctions";
import { containerVariants, itemVariants } from "../utils/constants";

function CarDetails() {
  const { registrationNumber } = useParams();
  const navigate = useNavigate();
  const [carDetails, setCarDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState("/images/default-car.jpg");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = () => {
      if (!registrationNumber) {
        setError("Invalid registration number");
        setLoading(false);
        return;
      }

      // Get vehicles from localStorage
      const vehicles = getLocalStorage("vehicles") || [];
      const registration = registrationNumber.trim().toUpperCase();

      // Find the vehicle by registrationNumber
      const vehicle = vehicles.find(
        (vehicle) => vehicle.registrationNumber.toUpperCase() === registration
      );

      if (!vehicle) {
        setError("Vehicle not found in garage");
        setLoading(false);
        return;
      }

      // Set car details
      console.log(vehicle);
      setCarDetails(vehicle);

      // Get image from imageCache
      const imageCache = getLocalStorage("imageCache") || {};
      const image = imageCache[vehicle.make] || "";
      setImageUrl(image);

      setError(null);
      setLoading(false);
    };

    fetchDetails();
  }, [registrationNumber]);

  // Render status badge
  const renderStatusBadge = (status, isTax) => {
    const isValid = status?.toLowerCase() === (isTax ? "taxed" : "valid");
    return (
      <span className="flex items-center justify-center gap-1 text-lg">
        {isValid ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaTimesCircle className="text-red-500" />
        )}
        <span>{status || "N/A"}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <svg
          className="w-8 h-8 text-blue-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center text-red-500"
      >
        {error}
      </motion.p>
    );
  }

  if (!carDetails) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center text-gray-500"
      >
        No car details available.
      </motion.p>
    );
  }

  return (
    <>
      <div className="relative w-full min-h-screen bg-gray-900">
        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 z-0 bg-black/50" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={` relative max-h-[80vh] w-[90%] lg:w-3/5  sm:max-w-[75%] mx-auto mt-4`}
          >
            {/* Navigation Button */}
            {/* Navigation Button */}
            <motion.div
              variants={itemVariants}
              className="flex items-center mt-6 transition bg-white hover:bg-yellow-400"
            >
              <div className="flex items-center ml-4 transition bg-white border border-gray-200 border-1 hover:bg-white hover:text-gray-700 hover:text-transform/95">
                <FaArrowLeft className="ml-2" />
                <button
                  onClick={() => navigate("/")}
                  className=" px-2 xs:px-4 w-[140px] xs:w-[196px] text-sm py-2 font-medium text-gray-800 "
                >
                  Back to homepage
                </button>
              </div>

              <motion.h1
                className="text-base w-[100px] xs:w-[180px]  xs:text-2xl font-bold my-4 max-w-[185px] mx-auto text-center border-3 bg-yellow-400 p-1 border "
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {carDetails.registrationNumber || "N/A"}
              </motion.h1>
            </motion.div>
            {/* Details Section */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col overflow-scroll h-[85vh] bg-white  shadow-md rounded-b-xl"
            >
              <motion.div
                variants={itemVariants}
                className="w-full mx-auto bg-center bg-cover shadow-lg min-h-64 lg:h-64 lg:bg-no-repeat"
                style={{ backgroundImage: `url(${imageUrl})` }}
              ></motion.div>
              <div className=" sm:w-[80%] lg:w-3/4 mt-2  mx-auto grid items-start grid-cols-1 gap-10 p-2 sm:p-8 md:gap-6 sm:grid-cols-1 lg:grid-cols-2 place-items-center">
                {/* Background Image Section */}

                {/* General Section */}
                <motion.div
                  variants={itemVariants}
                  className="w-full text-center "
                >
                  <h4 className="mb-3 text-xl font-semibold text-gray-800 ">
                    General Information
                  </h4>
                  <div className="flex flex-col gap-2 px-4 text-base text-gray-700 border-t border-gray-200">
                    <div className="flex justify-start">
                      <strong className="font-semibold">Registration:</strong>
                      <span className="ml-auto font-mono">
                        {carDetails.registrationNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Make:</strong>
                      <span className="ml-auto font-mono">
                        {formatString(carDetails.make)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Colour:</strong>
                      <span className="ml-auto font-mono">
                        {formatString(carDetails.colour)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Year:</strong>
                      <span className="ml-auto font-mono">
                        {carDetails.yearOfManufacture || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Fuel Type:</strong>
                      <span className="ml-auto font-mono">
                        {formatString(carDetails.fuelType)}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Technical Section */}
                <motion.div
                  variants={itemVariants}
                  className="w-full text-center"
                >
                  <h4 className="mb-3 text-xl font-semibold text-gray-800 ">
                    Technical Details
                  </h4>
                  <div className="flex flex-col gap-2 px-4 text-base text-gray-700 border-t border-gray-200">
                    <div className="flex justify-start">
                      <strong className="font-semibold">
                        Engine Capacity:
                      </strong>
                      <span className="ml-auto font-mono">
                        {carDetails.engineCapacity || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">CO2 Emissions:</strong>
                      <span className="ml-auto font-mono">
                        {carDetails.co2Emissions || "N/A"} g/km
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Type Approval:</strong>
                      <span className="ml-auto font-mono">
                        {carDetails.typeApproval || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Wheelplan:</strong>
                      <span className="ml-auto font-mono">
                        {formatString(carDetails.wheelplan)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Approval Type:</strong>
                      <span className="ml-auto font-mono">
                        {formatString(carDetails.typeApproval)}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Tax & MOT Section */}
                <motion.div
                  variants={itemVariants}
                  className="w-full text-center "
                >
                  <h4 className="mb-3 text-xl font-semibold text-gray-800 ">
                    Tax & MOT
                  </h4>
                  <div className="flex flex-col gap-2 px-4 text-base text-center text-gray-700 border-t border-gray-200 ">
                    <div className="flex justify-start">
                      <strong className="font-semibold">Tax Status:</strong>
                      <span className="ml-auto font-mono">
                        {renderStatusBadge(carDetails.taxStatus, true)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">Tax Due Date:</strong>
                      <span className="ml-auto font-mono">
                        {formatDate(carDetails.taxDueDate)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">MOT Status:</strong>
                      <span className="ml-auto font-mono">
                        {renderStatusBadge(carDetails.motStatus, false)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">
                        MOT Expiry Date:
                      </strong>
                      <span className="ml-auto font-mono">
                        {formatDate(carDetails.motExpiryDate)}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Registration Section */}
                <motion.div
                  variants={itemVariants}
                  className="w-full mb-6 text-center"
                >
                  <h4 className="mb-3 text-xl font-semibold text-gray-800 ">
                    Registration Details
                  </h4>
                  <div className="flex flex-col gap-2 px-4 text-base text-gray-700 border-t border-gray-200 ">
                    <div className="flex justify-start">
                      <strong className="font-semibold">
                        First Registration Date:
                      </strong>
                      <span className="ml-auto font-mono">
                        {formatDate(carDetails.monthOfFirstRegistration)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">
                        Last V5C Issued:
                      </strong>
                      <span className="ml-auto font-mono">
                        {formatDate(carDetails.dateOfLastV5CIssued)}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <strong className="font-semibold">
                        Marked for Export:
                      </strong>
                      <span className="ml-auto font-mono">
                        {carDetails.markedForExport ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Overlay */}
      </div>
    </>
  );
}

export default CarDetails;
