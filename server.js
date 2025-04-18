import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// Validate registration plate format
const validateRegPlate = (plate) =>
  /^[A-Z0-9]+$/.test(plate.trim().toUpperCase());

// Endpoint to fetch vehicles
app.post("/api/vehicles", async (req, res) => {
  const { registrationNumber } = req.body;

  // Validate input
  if (!registrationNumber || !validateRegPlate(registrationNumber)) {
    return res.status(400).json({
      error:
        "Registration number is required. Use alphanumeric characters only.",
    });
  }

  try {
    const response = await axios.post(
      process.env.DVLA_API_URL,
      {
        registrationNumber: registrationNumber.toUpperCase(),
      },
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
      return res.status(404).json({ error: "Vehicle not found" });
    }
    if (status === 401) {
      return res.status(401).json({ error: "Invalid DVLA API key" });
    }
    if (status === 429) {
      return res.status(429).json({ error: "DVLA API rate limit exceeded" });
    }

    // Log server errors for debugging
    console.error(`DVLA API error for registration ${registrationNumber}:`, {
      status,
      message,
    });
    res.status(500).json({
      error:
        "Failed to fetch vehicle data from DVLA, check registration number",
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
