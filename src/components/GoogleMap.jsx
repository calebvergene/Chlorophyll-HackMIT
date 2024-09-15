import { useState } from "react";
import { AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";
import Heatmap from "./Heatmap";
import landmarks from "../UHILandmarks.json";
import { controlNetPrompt } from "../config";
import toast from "react-hot-toast";

export default function GoogleMap() {
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [disabledGreenscape, setDisabledGreenscape] = useState(false);
  const [showAll, setShowAll] = useState(false); // State to control showing all images
  const [greenScapeImageUrls, setGreenScapeImageUrls] = useState([]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const size = "600x400";
  const fov = 90; // Set the field of view
  const pitch = 0; // Keep the pitch constant
  const headings = [0, 45, 90, 135, 180, 225, 270, 315]; // Panorama view angles

  const imageUrls = selectedLandmark
    ? headings.map((heading) => {
        return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${selectedLandmark.lat},${selectedLandmark.long}&fov=${fov}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;
      })
    : [];

  // Filter out only the even-indexed images
  const evenIndexedImages = imageUrls.filter((_, index) => index % 2 === 0);
  const imagesToShow = showAll
    ? evenIndexedImages
    : evenIndexedImages.slice(0, 6); // Show all or first 6 even-indexed images

  const clickLandmark = (landmark) => {
    setSelectedLandmark(landmark);

    // Check if the images are cached in localStorage
    const cachedImages = localStorage.getItem(landmark.locationName);
    if (cachedImages) {
      setGreenScapeImageUrls(JSON.parse(cachedImages));
    } else {
      setGreenScapeImageUrls([]);
    }
  };

  const closeModal = () => {
    setSelectedLandmark(null);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll); // Toggle between showing all and showing fewer images
  };

  const greenscape = async () => {
    setDisabledGreenscape(true);

    // Create a canvas to merge images
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const images = await Promise.all(
      evenIndexedImages.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = url;
          img.onload = () => resolve(img);
        });
      })
    );

    // Set canvas dimensions
    const width = images.reduce((sum, img) => sum + img.width, 0);
    const height = Math.max(...images.map((img) => img.height));
    canvas.width = width;
    canvas.height = height;

    // Draw images onto the canvas
    let xOffset = 0;
    images.forEach((img) => {
      context.drawImage(img, xOffset, 0);
      xOffset += img.width;
    });

    // Convert canvas to base64 and remove the prefix
    const mergedImageBase64 = canvas.toDataURL("image/png").split(",")[1];

    // Send the base64 image to the backend
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: controlNetPrompt,
        image: mergedImageBase64,
      }),
    });

    const result = await response.json();

    // Decode the base64 image
    const img = new Image();
    img.src = `data:image/png;base64,${result.image}`;
    img.onload = () => {
      // Create a canvas to draw the received image
      const receivedCanvas = document.createElement("canvas");
      const receivedContext = receivedCanvas.getContext("2d");
      receivedCanvas.width = img.width;
      receivedCanvas.height = img.height;
      receivedContext.drawImage(img, 0, 0);

      // Slice the canvas back into the original segments
      const segmentWidth = img.width / evenIndexedImages.length;
      const slicedImages = [];
      for (let i = 0; i < evenIndexedImages.length; i++) {
        const segmentCanvas = document.createElement("canvas");
        const segmentContext = segmentCanvas.getContext("2d");
        segmentCanvas.width = segmentWidth;
        segmentCanvas.height = img.height;
        segmentContext.drawImage(
          receivedCanvas,
          i * segmentWidth,
          0,
          segmentWidth,
          img.height,
          0,
          0,
          segmentWidth,
          img.height
        );
        slicedImages.push(segmentCanvas.toDataURL("image/png"));
      }

      // Cache the generated images for the selected landmark in localStorage
      try {
        localStorage.setItem(
          selectedLandmark.locationName,
          JSON.stringify(slicedImages)
        );
      } catch (error) {
        console.error("Local Storage Error: ", error);
        localStorage.clear();
        toast("Browser cache has been cleared to free up space.", {
          icon: "⚠️",
        });
      }

      // Display the sliced images
      setGreenScapeImageUrls(slicedImages);
    };

    setDisabledGreenscape(false);
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Google Map */}
      <Map
        defaultCenter={{ lat: 42.3601, lng: -71.0982 }}
        defaultZoom={14}
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
      <Heatmap />
      <AnimatePresence>
        {selectedLandmark && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1, 0.64, 1] }}
            className="fixed top-0 left-0 h-full w-1/3 bg-white shadow-lg z-50 p-6 px-8 text-black/90 overflow-auto rounded-r-3xl"
          >
            <div className="mb-6">
              <div className="flex justify-between items-center mb-5 w-full">
                <h2 className="font-bold text-4xl">
                  {selectedLandmark.locationName}
                </h2>
                <button
                  onClick={closeModal}
                  className="ml-auto px-2 py-2 text-black/90 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xl mb-1">
                <strong>📍Latitude:</strong> {selectedLandmark.lat}
              </p>
              <p className="text-xl mb-4">
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
            <div className="flex justify-between items-center mb-2 mt-7">
              <h2 className="font-bold text-3xl">Street View</h2>
              <button
                className={`${
                  disabledGreenscape
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                } text-white text-lg rounded-md p-2 px-7 pl-5 font-semibold flex items-center`}
                disabled={disabledGreenscape}
                onClick={greenscape}
              >
                {disabledGreenscape ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>
                )}
                {disabledGreenscape ? "Loading..." : "Activate Greenscape"}
              </button>
            </div>
            <div className="flex flex-wrap">
              {/* Displaying the even-indexed images */}
              {imagesToShow.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Street View Heading ${index * 45}`}
                  className="my-1 w-6/12 h-auto object-cover" // Adjust size here
                />
              ))}
            </div>

            {/* Show more button if there are more than 6 images */}
            {evenIndexedImages.length > 6 && (
              <button
                onClick={toggleShowAll}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}

            {greenScapeImageUrls.length > 0 && (
              <>
                <h2 className="font-bold text-3xl mt-6">Greenscape View</h2>
                <div className="flex flex-wrap">
                  {greenScapeImageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Greenscape View Heading ${index * 45}`}
                      className="my-1 w-6/12 h-auto object-cover"
                    />
                  ))}
                </div>
              </>
            )}
            <h2 className="font-bold text-3xl mt-6">Urban Heat Island Data</h2>
            <img className="mt-2" src="/0.png" alt="UHI Data" />

            {/* Clear browser cache */}
            <div className="w-full flex justify-center">
              <button
                onClick={() => {
                  localStorage.clear();
                  setGreenScapeImageUrls([]);
                }}
                className="mt-2 px-8 py-2 bg-red-500 text-white rounded font-medium"
              >
                Clear Cache
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
