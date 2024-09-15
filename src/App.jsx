import "./App.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleMap from "./components/GoogleMap";
import CustomPanorama from "./components/CustomPanorama";
import Home from "./pages/Home";

function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Router>
        <Routes>
          {/* Temporary, im making landing page */}
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<GoogleMap />} />
          <Route path="/panorama" element={<CustomPanorama />} />
        </Routes>
      </Router>
    </APIProvider>
  );
}

export default App;
