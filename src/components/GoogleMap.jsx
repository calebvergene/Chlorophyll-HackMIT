import React from 'react';
import { AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import landmarks from '../UHILandmarks.json';  // Import the JSON data

export default function GoogleMap() {

  return (
    <div className="h-screen w-screen">
      <Map defaultCenter={{ lat: 42.3601, lng: -71.0942 }} defaultZoom={10} mapId="DEMO_MAP_ID" gestureHandling={'greedy'} disableDefaultUI={true}>
        {landmarks.map((landmark, index) => (
          <AdvancedMarker
            key={index}
            position={{ lat: landmark.lat, lng: landmark.long }}  // Use coordinates from the JSON
          >
            <Pin background={'#68be5e'} glyphColor={'#027'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}
