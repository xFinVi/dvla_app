import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format, parse } from "date-fns";

function VehicleDetails({ vehicle }) {
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
    const isValid = status?.toLowerCase() === (isTax ? "taxed" : "sorn");
    return (
      <span className="flex items-center gap-1">
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
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.3 },
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white p-6 rounded-b-xl shadow-md border-t border-gray-200"
    >
      <div className="space-y-6">
        {/* General Section */}
        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-bold  underline text-gray-800 mb-3 border-b border-gray-200 pb-2">
            General Information
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="font-bold text-lg underline">
                Registration:
              </strong>{" "}
              <span className="font-mono">
                {vehicle.registrationNumber || "N/A"}
              </span>
            </div>
            <div>
              <strong className="font-bold text-lg underline">Make:</strong>{" "}
              {formatString(vehicle.make)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">Colour:</strong>{" "}
              {formatString(vehicle.colour)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">Year:</strong>{" "}
              {vehicle.yearOfManufacture || "N/A"}
            </div>
          </div>
        </motion.div>

        {/* Technical Section */}
        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-bold  underline text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Technical Details
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="font-bold text-lg underline">
                Fuel Type:
              </strong>{" "}
              {formatString(vehicle.fuelType)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                Engine Capacity:
              </strong>{" "}
              {vehicle.engineCapacity || "N/A"} cc
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                CO2 Emissions:
              </strong>{" "}
              {vehicle.co2Emissions || "N/A"} g/km
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                Type Approval:
              </strong>{" "}
              {vehicle.typeApproval || "N/A"}
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                Wheelplan:
              </strong>{" "}
              {formatString(vehicle.wheelplan)}
            </div>
          </div>
        </motion.div>

        {/* Tax & MOT Section */}
        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-bold  underline text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Tax & MOT
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="font-bold text-lg underline">
                Tax Status:
              </strong>{" "}
              {renderStatusBadge(vehicle.taxStatus, true)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                Tax Due Date:
              </strong>{" "}
              {formatDate(vehicle.taxDueDate)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                MOT Status:
              </strong>{" "}
              {renderStatusBadge(vehicle.motStatus, false)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                MOT Expiry Date:
              </strong>{" "}
              {formatDate(vehicle.motExpiryDate)}
            </div>
          </div>
        </motion.div>

        {/* Registration Section */}
        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-bold  underline text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Registration Details
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="font-bold text-lg underline">
                Month of First Registration:
              </strong>{" "}
              {formatDate(vehicle.monthOfFirstRegistration)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                Date of Last V5C Issued:
              </strong>{" "}
              {formatDate(vehicle.dateOfLastV5CIssued)}
            </div>
            <div>
              <strong className="font-bold text-lg underline">
                Marked for Export:
              </strong>{" "}
              {vehicle.markedForExport ? "Yes" : "No"}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default VehicleDetails;
