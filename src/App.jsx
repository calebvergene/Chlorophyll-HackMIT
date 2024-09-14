import './App.css'
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import GoogleMap from "./components/GoogleMap";
import StreetViewMap from "./components/StreetView";

function App() {
  return (
    <>
      <div>
      <GoogleMap/>
      <StreetViewMap />
    </div>
    </>
  )
}

export default App
