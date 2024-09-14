import { useState } from "react";
import { AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";
import landmarks from "../UHILandmarks.json";

export default function GoogleMap() {
  const [selectedLandmark, setSelectedLandmark] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const size = "600x400";
  const fov = 90; // Set the field of view
  const pitch = 0; // Keep the pitch constant
  // Generate an array of headings to create the panorama (e.g., 0°, 45°, 90°, ... 360°)
  const headings = [0, 45, 90, 135, 180, 225, 270, 315];
  const imageUrls = selectedLandmark
    ? headings.map((heading) => {
        return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${selectedLandmark.lat},${selectedLandmark.long}&fov=${fov}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;
      })
    : [];

  const clickLandmark = (landmark) => {
    setSelectedLandmark(landmark);
  };

  const closeModal = () => {
    setSelectedLandmark(null);
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Google Map */}
      <Map
        defaultCenter={{ lat: 42.3601, lng: -71.0942 }}
        defaultZoom={10}
        mapId="DEMO_MAP_ID"
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {landmarks.map((landmark, index) => (
          <AdvancedMarker
            key={index}
            position={{ lat: landmark.lat, lng: landmark.long }}
            onClick={() => clickLandmark(landmark)}
          >
            <Pin
              background={"#00000"}
              glyphColor={"#090"}
              borderColor={"#000"}
            />
          </AdvancedMarker>
        ))}
      </Map>

      <AnimatePresence>
        {selectedLandmark && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 h-full w-1/3 bg-white shadow-lg z-50 p-6 text-black/90 overflow-auto"
          >
            <h2 className="text-xl font-bold mb-4">Landmark Details</h2>
            <p>
              <strong>Latitude:</strong> {selectedLandmark.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {selectedLandmark.long}
            </p>
            <p>
              <strong>Annual Daytime SUHI:</strong>{" "}
              {selectedLandmark["Annual daytime SUHI"]}
            </p>
            <p>
              <strong>Annual Nighttime SUHI:</strong>{" "}
              {selectedLandmark["Annual nighttime SUHI"]}
            </p>
            <p>
              <strong>Summer Daytime SUHI:</strong>{" "}
              {selectedLandmark["Summer daytime SUHI"]}
            </p>
            <p>
              <strong>Summer Nighttime SUHI:</strong>{" "}
              {selectedLandmark["Summer nighttime SUHI"]}
            </p>
            <p>
              <strong>Winter Daytime SUHI:</strong>{" "}
              {selectedLandmark["Winter daytime SUHI"]}
            </p>
            <p>
              <strong>Winter Nighttime SUHI:</strong>{" "}
              {selectedLandmark["Winter nighttime SUHI"]}
            </p>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
            <div className="flex flex-wrap">
              {/* Displaying all of the images needed for the panorama */}
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Street View Heading ${index * 45}`}
                  className="m-1"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
