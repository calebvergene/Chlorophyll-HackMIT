"use client";

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";

export default function GoogleMap() {
  const [coords, setCoords] = useState({ lat: 42.3601, lng: -71.0942 });

  //process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

  const googleAPIKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  return (
    <APIProvider apiKey={googleAPIKey}>
      <div className="h-screen w-screen">
       {/* Can customize how map looks with map ID*/}
        <Map defaultCenter={coords} defaultZoom={10} mapId="DEMO_MAP_ID">
          <AdvancedMarker position={coords} />
        </Map>
      </div>

    </APIProvider>
  );
}