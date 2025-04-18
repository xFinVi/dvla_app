import React from "react";
import { motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="py-6 text-center text-gray-600 border-t min-h-[20vh] flex justify-center items-center w-full  border-gray-300 p-6 bg-gradient-to-b from-gray-200 to-gray-300"
    >
      <p className="text-sm font-medium">Car Registration App © 2025</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="flex items-center justify-center p-1 ml-6 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Back to top"
      >
        <FaArrowUp className="w-4 h-4" />
      </motion.button>
    </motion.footer>
  );
}

export default Footer;
