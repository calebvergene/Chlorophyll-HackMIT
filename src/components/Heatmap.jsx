import { useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import landmarks from "../UHILandmarks.json";

const Heatmap = () => {
  const map = useMap();
  const visualization = useMapsLibrary("visualization");

  const heatmap = useMemo(() => {
    if (!visualization) return null;

    return new window.google.maps.visualization.HeatmapLayer({
      radius: 80,
      opacity: 0.7,
    });
  }, [visualization]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setData(
      landmarks.map((landmark) => {
        const lat = landmark.lat;
        const lng = landmark.long;

        return {
          location: new window.google.maps.LatLng(lat, lng),
          weight: 2,
        };
      })
    );
  }, [heatmap]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [heatmap, map]);

  return null;
};

export default Heatmap;
