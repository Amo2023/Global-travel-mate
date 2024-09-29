import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "./../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import "leaflet/dist/leaflet.css";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  // const [mapLat,mapLng]=useUrlPosition()
  const [searchParams, setSearchParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  
  // synchronise mapLat｜mapLng with mapPosition
  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );
  useEffect(
    function () {
      if (geolocationPosition) {
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {/* {!geolocationPosition && ( */}
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading.." : "Use your position"}
        </Button>
      {/* )} */}

      <MapContainer
        center={mapPosition}
        zoom={5}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.cityName}</span>

              <span>{city.emoji}</span>
            </Popup>
          </Marker>
        ))}

        {/* Render marker for user's current position if available */}
        {geolocationPosition && (
          <Marker position={[geolocationPosition.lat, geolocationPosition.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        <ChangeMap position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeMap({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      // console.log(e);
      navigate(`form?lat=${e.latlng.lat}&&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;