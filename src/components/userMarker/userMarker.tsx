import { Marker } from "react-map-gl";
import { useAppSelector } from "@/redux/hooks";
import { memo, useEffect, useState } from "react";
import Image from "next/image";
import location from "../../../public/images/location.webp";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./userMarker.module.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}
const requestPermission = (
  DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
).requestPermission;
const iOS = typeof requestPermission === "function";

export const UserMarker = memo(function UserMarker() {
  const [motionPermission, setMotionPermission] = useState<boolean>(false);
  const [motion, setMotion] = useState<any>({ x: "na", y: "gdfhdfjf" });
  const viewState = useAppSelector((state) => state.map);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    setLocation();
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
      const x = event.acceleration?.x;
      const y = event.acceleration?.y;
      if (x && y) {
        if (x > 1 || x < -1) {
          setMotion({ ...motion, x: x });
        } else if (y > 1 || y < -1) {
          setMotion({ ...motion, y: y });
        }
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
        <div className={styles.motion}>
          {motion.x} {motion.y}
        </div>
        <Image src={location} alt={"location of user"} height={40} width={40} />
      </Marker>
    </div>
  );
});
