import { Marker } from "react-map-gl";
import { useAppSelector } from "@/redux/hooks";
import { memo, useEffect, useState } from "react";
import Image from "next/image";
import location from "../../../public/images/location.webp";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./userMarker.module.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { group } from "console";

interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}
const requestPermission = (DeviceMotionEvent as unknown as DeviceMotionEventiOS)
  .requestPermission;
const iOS = typeof requestPermission === "function";

export const UserMarker = memo(function UserMarker() {
  const [motionPermission, setMotionPermission] = useState<boolean>(false);
  const [motion, setMotion] = useState<any>({ x: "na", y: "gdfhdfjf" });
  const viewState = useAppSelector((state) => state.map);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });

  // set location of user marker on initial load then sets window functions to update location
  useEffect(() => {
    setLocation();

    if (typeof window !== "undefined") {
      window.onload = function () {
        setLocation();
      };
      window.onfocus = function () {
        setLocation();
      };
    }
  }, []);

  // initialise onClick handler on map as permission for motion device events can only be triggered after user interaction
  useEffect(() => {
    if (motionPermission === false) {
      document
        .querySelector(".mapboxgl-canvas")
        ?.addEventListener("click", handlePermissions);
    }
  }, [motionPermission]);

  // request the permission for motion events
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

  // detect motion and update location
  function handleDeviceMotion() {
    setMotionPermission(true);
    window.addEventListener("devicemotion", (event) => {
      const x = event.acceleration?.x;
      const y = event.acceleration?.y;
      if (x && y) {
        if (x > 1 || x < -1) {
          // setMotion((existing: any) => ({ ...existing, x: x }));
          setLocation();
        }
        if (y > 1 || y < -1) {
          // setMotion((existing: any) => ({ ...existing, y: y }));
          setLocation();
        }
      }
    });
    document
      .querySelector(".mapboxgl-canvas")
      ?.removeEventListener("click", handlePermissions);
  }

  // set the position of the use marker with the coordinates of the device
  function setLocation() {
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
