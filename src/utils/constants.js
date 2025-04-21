// Default registration numbers

export const defaultRegistrations = [
  "AY18OOT",
  "V14BYE",
  "RV70JSU",
  "RJ66WFN",
  "KP13FMA",
];

export const ERROR_MESSAGES = {
  EMPTY_REG: "Please enter a registration number.",
  INVALID_REG: "Vehicle not found. Please check the registration number.",
  DUPLICATE_REG: "Vehicle with this registration number already exists.",
  INVALID_DATA: "Invalid vehicle data returned.",
  API_ERROR: "Failed to fetch vehicle data. Try again later.",
  RATE_LIMIT: "DVLA API rate limit exceeded.",
};

export const API_URLS = {
  DVLA: "http://localhost:3001/api/vehicles",
};

export const defaultBackground = [
  "https://img.freepik.com/free-photo/modern-empty-room_23-2150528603.jpg?t=st=1745158803~exp=1745162403~hmac=70b036fe5a395fbf0dd3d6842773191723f84eb11ebfc6e4108881e4d40bebff&w=996",
  "https://img.freepik.com/premium-photo/racing-car-garage-automotive-sports-car_1246444-79907.jpg?w=826",
  "https://img.freepik.com/free-photo/roller-door-roller-shutter-using-factory-warehouse-generative-ai_91128-2383.jpg?t=st=1745160304~exp=1745163904~hmac=0cc35ebd0e72f5233a12c71c6e3042c4a1bc674d05b8d160ffdfc3c51eabe9ac&w=1380",
  "https://img.freepik.com/premium-photo/body-shop-with-cars-work_23-2147897925.jpg?w=996",
  "https://img.freepik.com/premium-photo/empty-dark-industrial-garage-with-steel-roller-shutter-door-metal-floor-walls-as-background-product-presentation-mockup_981948-31272.jpg?w=1380",
];

const randomIndex = Math.floor(Math.random() * defaultBackground.length);

export const backgroundImage = `url(${defaultBackground[randomIndex]} `;

// Animation variants
export const containerVariants = {
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

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
