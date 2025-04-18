import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format, parse } from "date-fns";
import { fetchVehicleDetails } from "../utils/api";
import { fetchCarImage } from "../utils/imageApi";

function CarDetails() {
  const { registrationNumber } = useParams();
  const navigate = useNavigate();
  const [carDetails, setCarDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState("/images/default-car.jpg");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!registrationNumber) {
        setError("Invalid registration number");
        setLoading(false);
        return;
      }

      try {
        const details = await fetchVehicleDetails(
          registrationNumber.trim().toUpperCase()
        );
        if (details && details.error) {
          setError(details.error);
          setLoading(false);
          return;
        }
        setCarDetails(details);
        if (details.make && details.make !== "Unknown") {
          const url = await fetchCarImage(details.make);
          setImageUrl(url);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError("Error fetching car details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [registrationNumber]);

  // Format strings ( DIESEL to Diesel)
  const formatString = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "N/A";

  // Format dates ( 2025-10-01 to 01 Oct 2025)
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = parse(dateStr, "yyyy-MM-dd", new Date());
      return format(date, "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto mt-16"
    >
      <motion.h1
        className="text-2xl font-bold my-4 max-w-[185px] mx-auto text-center border-3 bg-yellow-400 p-1 border w-1/2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {" "}
        {carDetails.registrationNumber || "N/A"}
      </motion.h1>
      {/* Background Image Section */}
      <motion.div
        variants={itemVariants}
        className="h-64 mx-auto bg-center bg-cover shadow-lg lg:h-96 sm:w-full lg:bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></motion.div>

      {/* Details Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col flex-1 p-6 bg-white border border-gray-200 shadow-md rounded-b-xl"
      >
        <div className="grid items-start grid-cols-1 gap-12 md:gap-6 sm:grid-cols-1 place-items-center">
          {/* General Section */}
          <motion.div variants={itemVariants} className="w-full text-center ">
            <h4 className="pb-2 mb-3 text-2xl font-semibold text-gray-800 border-b border-gray-200">
              General Information
            </h4>
            <div className="space-y-2 text-base text-gray-700">
              <div className="flex justify-start">
                <strong className="font-semibold">Registration:</strong>{" "}
                <span className="ml-auto font-mono">
                  {carDetails.registrationNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Make:</strong>{" "}
                <span className="ml-auto font-mono">
                  {formatString(carDetails.make)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Colour:</strong>{" "}
                <span className="ml-auto font-mono">
                  {formatString(carDetails.colour)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Year:</strong>{" "}
                <span className="ml-auto font-mono">
                  {" "}
                  {carDetails.yearOfManufacture || "N/A"}{" "}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Fuel Type:</strong>{" "}
                <span className="ml-auto font-mono">
                  {formatString(carDetails.fuelType)}{" "}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Technical Section */}
          <motion.div variants={itemVariants} className="w-full text-center">
            <h4 className="pb-2 mb-3 text-2xl font-semibold text-gray-800 border-b border-gray-200">
              Technical Details
            </h4>
            <div className="space-y-2 text-base text-gray-700">
              <div className="flex justify-start">
                <strong className="font-semibold">Engine Capacity:</strong>{" "}
                <span className="ml-auto font-mono">
                  {" "}
                  {carDetails.engineCapacity || "N/A"}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">CO2 Emissions:</strong>{" "}
                <span className="ml-auto font-mono">
                  {carDetails.co2Emissions || "N/A"} g/km
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Type Approval:</strong>{" "}
                <span className="ml-auto font-mono">
                  {carDetails.typeApproval || "N/A"}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Wheelplan:</strong>{" "}
                <span className="ml-auto font-mono">
                  {formatString(carDetails.wheelplan)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Approval Type:</strong>{" "}
                <span className="ml-auto font-mono">
                  {formatString(carDetails.typeApproval)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tax & MOT Section */}
          <motion.div variants={itemVariants} className="w-full text-center ">
            <h4 className="pb-2 mb-2 text-2xl font-semibold text-gray-800 border-b border-gray-200">
              Tax & MOT
            </h4>
            <div className="space-y-2 text-base text-center text-gray-700">
              <div className="flex justify-start">
                <strong className="font-semibold">Tax Status:</strong>{" "}
                <span className="ml-auto font-mono">
                  {renderStatusBadge(carDetails.taxStatus, true)}{" "}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Tax Due Date:</strong>{" "}
                <span className="ml-auto font-mono">
                  {formatDate(carDetails.taxDueDate)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">MOT Status:</strong>{" "}
                <span className="ml-auto font-mono">
                  {renderStatusBadge(carDetails.motStatus, false)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">MOT Expiry Date:</strong>{" "}
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
            <h4 className="pb-2 mb-3 text-2xl font-semibold text-gray-800 border-b border-gray-200">
              Registration Details
            </h4>
            <div className="space-y-2 text-base text-gray-700">
              <div className="flex justify-start">
                <strong className="font-semibold">
                  Month of First Registration:
                </strong>{" "}
                <span className="ml-auto font-mono">
                  {formatDate(carDetails.monthOfFirstRegistration)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">
                  Date of Last V5C Issued:
                </strong>{" "}
                <span className="ml-auto font-mono">
                  {" "}
                  {formatDate(carDetails.dateOfLastV5CIssued)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Marked for Export:</strong>{" "}
                <span className="ml-auto font-mono">
                  {carDetails.markedForExport ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Button */}
        <motion.div variants={itemVariants} className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default CarDetails;
