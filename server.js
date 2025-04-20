import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { body, validationResult } from "express-validator";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Validate environment variables
if (!process.env.DVLA_API_URL || !process.env.DVLA_API_KEY) {
  console.error("Missing DVLA_API_URL or DVLA_API_KEY in .env");
  process.exit(1);
}

const sendError = (res, status, message) => {
  console.error(`[${new Date().toISOString()}] Error: ${message}`, { status });
  res.status(status).json({ error: message });
};

// Endpoint to fetch vehicle details
app.post(
  "/api/vehicles",
  [
    body("registrationNumber")
      .trim()
      .notEmpty()
      .withMessage("Please enter a registration number.")
      .isLength({ min: 2, max: 7 })
      .withMessage("Registration number must be 2 to 7 characters long.")
      .matches(/^[A-Z0-9]+$/)
      .withMessage(
        "Registration number must contain only letters and numbers."
      ),
    // Optional: Stricter UK plate format
    // .matches(/^[A-Z]{1,2}[0-9]{1,2}[A-Z]{1,3}$/)
    // .withMessage("Please enter a valid UK registration number (e.g., AK13BBX).")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return sendError(res, 400, errorMessages.join(" "));
    }

    const { registrationNumber } = req.body;

    try {
      const response = await axios.post(
        process.env.DVLA_API_URL,
        { registrationNumber: registrationNumber.toUpperCase() },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.DVLA_API_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error || error.message;

      if (status === 404) {
        return sendError(
          res,
          404,
          "Car registration not found in the database."
        );
      }
      if (status === 401) {
        return sendError(res, 401, "Invalid DVLA API key.");
      }
      if (status === 429) {
        return sendError(res, 429, "DVLA API rate limit exceeded.");
      }
      sendError(res, 500, "Failed to fetch vehicle data from DVLA.");
    }
  }
);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.info(`Server running on http://localhost:${port}`);
});
