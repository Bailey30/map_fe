import { Marker } from "react-map-gl";
import { useAppSelector } from "@/redux/hooks";
import { memo, useEffect, useState } from "react";
import Image from "next/image";
import location from "../../../public/images/location.webp";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./userMarker.module.css";

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}
const requestPermission = (
  DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
).requestPermission;
const iOS = typeof requestPermission === "function";

export const UserMarker = memo(function UserMarker() {
  const [motionPermission, setMotionPermission] = useState<boolean>(false);
  const viewState = useAppSelector((state) => state.map);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    setLocation();

    window.addEventListener("devicemotion", (event) => {
      if (event.acceleration?.x || event.acceleration?.y) {
        // alert(`${event.acceleration.x} " + " ${event.acceleration.y}`);
      }

      // alert(event);
    });

    if (window.DeviceMotionEvent) {
      // alert("device motion supported")
    } else {
      // alert("device motion not supported")
    }
  }, []);

  useEffect(() => {
    if (motionPermission === false) {
      document
        .querySelector(".mapboxgl-canvas")
        ?.addEventListener("click", handlePermissions);
    }
  }, [motionPermission]);

  function handlePermissions() {
    if (iOS) {
      requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            handleDeviceMotion();
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
      handleDeviceMotion();
    }
  }
  // permissions state

  function handleDeviceMotion() {
    setMotionPermission(true);
    window.addEventListener("devicemotion", (event) => {
      console.log(event);
      if (event.acceleration?.x || event.acceleration?.y) {
        alert(`${event.acceleration.x} " + " ${event.acceleration.y}`);
      }
    });
    document
      .querySelector(".mapboxgl-canvas")
      ?.removeEventListener("click", handlePermissions);
  }

  if (typeof window !== "undefined") {
    window.onload = function () {
      setLocation();
    };
    window.onfocus = function () {
      setLocation();
    };
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
