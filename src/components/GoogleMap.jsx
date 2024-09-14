import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";

export default function GoogleMap() {
  const [coords, setCoords] = useState({ lat: 42.3601, lng: -71.0942 });

  return (
    <div className="h-screen w-screen">
      {/* Can customize how map looks with map ID*/}
      <Map defaultCenter={coords} defaultZoom={10} mapId="DEMO_MAP_ID">
        <AdvancedMarker position={coords} />
      </Map>
    </div>
  );
}
