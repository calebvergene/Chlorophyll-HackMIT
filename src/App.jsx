import "./App.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import GoogleMap from "./components/GoogleMap";
import StreetViewMap from "./components/StreetView";

function App() {
  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap />
        <StreetViewMap />
      </APIProvider>
    </>
  );
}

export default App;
