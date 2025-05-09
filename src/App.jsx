import { BrowserRouter, Routes, Route } from "react-router-dom";
import Garage from "./components/Garage";
import CarDetails from "./components/CarDetails";
import Footer from "./components/footer";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<Garage />} />
        <Route path="/car/:registrationNumber" element={<CarDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
