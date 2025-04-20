Garage Management App

This is a web application for managing a virtual garage, allowing users to add, view, and remove vehicles using UK registration numbers. Built with React, Express, and Tailwind CSS, it integrates with the DVLA API to fetch vehicle details and the Unsplash API for vehicle images. The app features a responsive UI with smooth animations, localStorage persistence, and efficient caching to minimize API calls.

Installation and Setup

Node.js (v16 or higher)

npm (v8 or higher)

Git

.env files for DVLA and Unsplash API keys (provided via email)

git clone https://github.com/xFinVi/dvla_app
cd dvla_app
npm install


Start the Server:

npm start
The server runs on http://localhost:3001.



Start the Frontend:

In a new terminal:

npm run dev

The app runs on http://localhost:5345 (or another port if prompted).

Access the App:


Open http://localhost:5345  in a browser.


Ensure the DVLA and Unsplash API keys in the .env files are valid.

Clear localStorage in the browser to reset to default vehicles.



check if port 3001 or 5345 are in use.
# carReg
