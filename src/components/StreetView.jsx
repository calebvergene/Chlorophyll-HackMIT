const StreetViewPanorama = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const lat = 42.345573;
  const lng = -71.098326;
  const size = "600x400";
  const fov = 90; // Set the field of view
  const pitch = 0; // Keep the pitch constant

  // Generate an array of headings to create the panorama (e.g., 0°, 45°, 90°, ... 360°)
  const headings = [0, 45, 90, 135, 180, 225, 270, 315];

  const imageUrls = headings.map((heading) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&fov=${fov}&heading=${heading}&pitch=${pitch}&key=${apiKey}`;
  });

  return (
    <div>
      <h1>Street View Panorama</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Displaying all of the images needed for the panorama */}
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Street View Heading ${index * 45}`}
            style={{ margin: "5px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default StreetViewPanorama;
