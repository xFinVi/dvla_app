import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format, formatDate, parse } from "date-fns";
import { formatString } from "../utils/helperFunctions";

function VehicleDetails({ vehicle }) {
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
      className="p-6 bg-white border-t border-gray-200 shadow-md rounded-b-xl"
    >
      <div className="space-y-6">
        {/* General Section */}
        <motion.div variants={itemVariants}>
          <h4 className="pb-2 mb-3 text-lg font-bold text-gray-800 underline border-b border-gray-200">
            General Information
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="text-lg font-bold underline">
                Registration:
              </strong>{" "}
              <span className="font-mono">
                {vehicle.registrationNumber || "N/A"}
              </span>
            </div>
            <div>
              <strong className="text-lg font-bold underline">Make:</strong>{" "}
              {formatString(vehicle.make)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">Colour:</strong>{" "}
              {formatString(vehicle.colour)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">Year:</strong>{" "}
              {vehicle.yearOfManufacture || "N/A"}
            </div>
          </div>
        </motion.div>

        {/* Technical Section */}
        <motion.div variants={itemVariants}>
          <h4 className="pb-2 mb-3 text-lg font-bold text-gray-800 underline border-b border-gray-200">
            Technical Details
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="text-lg font-bold underline">
                Fuel Type:
              </strong>{" "}
              {formatString(vehicle.fuelType)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                Engine Capacity:
              </strong>{" "}
              {vehicle.engineCapacity || "N/A"} cc
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                CO2 Emissions:
              </strong>{" "}
              {vehicle.co2Emissions || "N/A"} g/km
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                Type Approval:
              </strong>{" "}
              {vehicle.typeApproval || "N/A"}
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                Wheelplan:
              </strong>{" "}
              {formatString(vehicle.wheelplan)}
            </div>
          </div>
        </motion.div>

        {/* Tax & MOT Section */}
        <motion.div variants={itemVariants}>
          <h4 className="pb-2 mt-8 mb-3 text-lg font-bold text-gray-800 underline border-b border-gray-200">
            Tax & MOT
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="text-lg font-bold underline">
                Tax Status:
              </strong>{" "}
              {renderStatusBadge(vehicle.taxStatus, true)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                Tax Due Date:
              </strong>{" "}
              {formatDate(vehicle.taxDueDate)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                MOT Status:
              </strong>{" "}
              {renderStatusBadge(vehicle.motStatus, false)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                MOT Expiry Date:
              </strong>{" "}
              {formatDate(vehicle.motExpiryDate)}
            </div>
          </div>
        </motion.div>

        {/* Registration Section */}
        <motion.div variants={itemVariants}>
          <h4 className="pb-2 mb-3 text-lg font-bold text-gray-800 underline border-b border-gray-200">
            Registration Details
          </h4>
          <div className="space-y-2 text-base text-gray-700">
            <div>
              <strong className="text-lg font-bold underline">
                Month of First Registration:
              </strong>{" "}
              {formatDate(vehicle.monthOfFirstRegistration)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">
                Date of Last V5C Issued:
              </strong>{" "}
              {formatDate(vehicle.dateOfLastV5CIssued)}
            </div>
            <div>
              <strong className="text-lg font-bold underline">
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
