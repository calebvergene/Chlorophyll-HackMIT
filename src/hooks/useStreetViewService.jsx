import { useState, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function useStreetViewService() {
  const streetViewLibrary = useMapsLibrary("streetView");
  const [streetViewService, setStreetViewService] = useState(null);

  useEffect(() => {
    if (!streetViewLibrary) return;

    setStreetViewService(new streetViewLibrary.StreetViewService());
  }, [streetViewLibrary]);

  return streetViewService;
}
