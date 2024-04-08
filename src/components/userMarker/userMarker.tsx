import { Marker } from "react-map-gl";
import { useAppSelector } from "@/redux/hooks";
import { memo, useEffect, useState } from "react";
import Image from "next/image";
import location from "../../../public/images/location.webp";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./userMarker.module.css";

export const UserMarker = memo(function UserMarker() {
  const viewState = useAppSelector((state) => state.map);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    setLocation();
  }, []);

  if (typeof window !== "undefined") {
    window.onload = function () {
      setLocation();
    };

    window.addEventListener("devicemotion", (event) => {
      if (event.acceleration?.x || event.acceleration?.y) {
        alert(`${event.acceleration.x} " + " ${event.acceleration.y}`);
      }
    });
  }

  function setLocation() {
    console.log("setting user location");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }

  return (
    <div className={styles.userMarker}>
      <Marker
        latitude={userLocation.latitude}
        longitude={userLocation.longitude}
      >
        <Image src={location} alt={"location of user"} height={40} width={40} />
      </Marker>
    </div>
  );
});
