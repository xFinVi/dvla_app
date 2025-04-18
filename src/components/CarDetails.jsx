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

  // Format strings (e.g., DIESEL -> Diesel)
  const formatString = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "N/A";

  // Format dates (e.g., 2025-10-01 -> 01 Oct 2025)
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
      <span className="flex items-center gap-1 justify-center text-lg">
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
      <div className="p-6 flex justify-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
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
        className="p-6 text-red-500 text-center"
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
        className="p-6 text-gray-500 text-center"
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
      className="mt-16 max-w-4xl mx-auto"
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
        className="lg:h-96 h-64 mx-auto sm:w-full bg-cover lg:bg-no-repeat bg-center  shadow-lg"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></motion.div>

      {/* Details Section */}
      <motion.div
        variants={itemVariants}
        className="p-6 bg-white flex flex-col flex-1 rounded-b-xl shadow-md border border-gray-200"
      >
        <div className=" gap-12 md:gap-6 grid grid-cols-1 sm:grid-cols-1 place-items-center  items-start">
          {/* General Section */}
          <motion.div variants={itemVariants} className="w-full text-center ">
            <h4 className="text-2xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              General Information
            </h4>
            <div className="space-y-2 text-base text-gray-700">
              <div className="flex justify-start">
                <strong className="font-semibold">Registration:</strong>{" "}
                <span className="font-mono ml-auto">
                  {carDetails.registrationNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Make:</strong>{" "}
                <span className="font-mono ml-auto">
                  {formatString(carDetails.make)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Colour:</strong>{" "}
                <span className="font-mono ml-auto">
                  {formatString(carDetails.colour)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Year:</strong>{" "}
                <span className="font-mono ml-auto">
                  {" "}
                  {carDetails.yearOfManufacture || "N/A"}{" "}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Fuel Type:</strong>{" "}
                <span className="font-mono ml-auto">
                  {formatString(carDetails.fuelType)}{" "}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Technical Section */}
          <motion.div variants={itemVariants} className="w-full text-center">
            <h4 className="text-2xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              Technical Details
            </h4>
            <div className="space-y-2 text-base text-gray-700">
              <div className="flex justify-start">
                <strong className="font-semibold">Engine Capacity:</strong>{" "}
                <span className="font-mono ml-auto">
                  {" "}
                  {carDetails.engineCapacity || "N/A"}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">CO2 Emissions:</strong>{" "}
                <span className="font-mono ml-auto">
                  {carDetails.co2Emissions || "N/A"} g/km
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Type Approval:</strong>{" "}
                <span className="font-mono ml-auto">
                  {carDetails.typeApproval || "N/A"}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Wheelplan:</strong>{" "}
                <span className="font-mono ml-auto">
                  {formatString(carDetails.wheelplan)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Approval Type:</strong>{" "}
                <span className="font-mono ml-auto">
                  {formatString(carDetails.typeApproval)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tax & MOT Section */}
          <motion.div variants={itemVariants} className="w-full text-center ">
            <h4 className="text-2xl font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">
              Tax & MOT
            </h4>
            <div className="space-y-2 text-base text-gray-700 text-center">
              <div className="flex justify-start">
                <strong className="font-semibold">Tax Status:</strong>{" "}
                <span className="font-mono ml-auto">
                  {renderStatusBadge(carDetails.taxStatus, true)}{" "}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Tax Due Date:</strong>{" "}
                <span className="font-mono ml-auto">
                  {formatDate(carDetails.taxDueDate)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">MOT Status:</strong>{" "}
                <span className="font-mono ml-auto">
                  {renderStatusBadge(carDetails.motStatus, false)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">MOT Expiry Date:</strong>{" "}
                <span className="font-mono ml-auto">
                  {formatDate(carDetails.motExpiryDate)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Registration Section */}
          <motion.div
            variants={itemVariants}
            className="w-full text-center mb-6"
          >
            <h4 className="text-2xl font-semibold text-gray-800 mb-3 border-b  border-gray-200 pb-2">
              Registration Details
            </h4>
            <div className="space-y-2 text-base text-gray-700">
              <div className="flex justify-start">
                <strong className="font-semibold">
                  Month of First Registration:
                </strong>{" "}
                <span className="font-mono ml-auto">
                  {formatDate(carDetails.monthOfFirstRegistration)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">
                  Date of Last V5C Issued:
                </strong>{" "}
                <span className="font-mono ml-auto">
                  {" "}
                  {formatDate(carDetails.dateOfLastV5CIssued)}
                </span>
              </div>
              <div className="flex justify-start">
                <strong className="font-semibold">Marked for Export:</strong>{" "}
                <span className="font-mono ml-auto">
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default CarDetails;
