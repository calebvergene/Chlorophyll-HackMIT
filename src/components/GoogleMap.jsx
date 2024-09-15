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
        defaultZoom={12}
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
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3 w-full">
                    <h2 className="font-bold text-4xl">Landmark Details</h2>
                    <button
                        onClick={closeModal}
                        className="ml-auto px-2 py-2 bg-black/90 text-white rounded-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                </div>
                <p className="text-xl mb-1">
                <strong>📍Latitude:</strong> {selectedLandmark.lat}
                </p>
                <p className="text-xl mb-1">
                <strong>📍Longitude:</strong> {selectedLandmark.long}
                </p>
                <p className="text-xl mb-1">
                <strong>🌅 Annual Daytime SUHI:</strong>{" "}
                {selectedLandmark["Annual daytime SUHI"]}
                </p>
                <p className="text-xl mb-1">
                <strong>🌃 Annual Nighttime SUHI:</strong>{" "}
                {selectedLandmark["Annual nighttime SUHI"]}
                </p>
            </div>
            
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
