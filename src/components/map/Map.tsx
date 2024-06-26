"use client";
import guinnessArrow from "../../../public/images/guinness_arrow.png";
import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import styles from "./map.module.css";
import { GeolocateControl, Map, Marker } from "react-map-gl";
import { MOVE_TO } from "@/redux/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import "mapbox-gl/dist/mapbox-gl.css";
import { UserMarker } from "../userMarker/userMarker";
import { useRouter } from "next/navigation";
import { Location } from "@/utils/types";
import clsx from "clsx";
import { SET_SHOW_CONTROLS } from "@/redux/controlsSlice";
import SendResetPasswordEmail from "@/lib/sendResetPasswordEmail";

interface Props {
  data: Location[] | undefined;
}

export default function MapComponent({ data }: Props) {
  const mapRef = useRef(null) as any;
  const dispatch = useAppDispatch();
  const viewState = useAppSelector((state) => state.map);
  const { recentPrice, priceRange, isAdding } = useAppSelector(
    (state) => state.controls,
  );
  const router = useRouter();

  // could move into a hook called useMapControls
  useEffect(() => {
    // if there is coords stored in session storage - use them
    const sessionLat = sessionStorage.getItem("latitude");
    const sessionLong = sessionStorage.getItem("longitude");
    const sessionZoom = sessionStorage.getItem("zoom");
    if (
      sessionLat &&
      sessionLong &&
      sessionLat !== "0" &&
      sessionLong !== "0"
    ) {
      dispatch(
        MOVE_TO({
          longitude: parseFloat(sessionLong),
          latitude: parseFloat(sessionLat),
          zoom: sessionZoom,
        }),
      );
    } else {
      if ("geolocation" in navigator) {
        // if not - do this
        navigator.geolocation.getCurrentPosition((position) => {
          dispatch(
            MOVE_TO({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              zoom: viewState.zoom,
            }),
          );
        });
      } else {
        console.log("geolocation not happenin");
      }
    }
  }, []);

  if (typeof window !== "undefined") {
    window.onbeforeunload = function () {
      sessionStorage.setItem("latitude", String(viewState.latitude));
      sessionStorage.setItem("longitude", String(viewState.longitude));
      sessionStorage.setItem("zoom", String(viewState.zoom));
    };
  }

  function onMove(e: any) {
    const { longitude, latitude, zoom } = e.viewState;
    dispatch(MOVE_TO({ longitude, latitude, zoom }));
  }

  function onClick(e: any) {
    dispatch(SET_SHOW_CONTROLS(false));
  }

  function onMarkerClick(mark: Location) {
    router.push(`/location/${mark.id}`);
  }

  console.log({ data });
  const markers = useMemo(
    () =>
      data
        ?.filter((mark: Location) => {
          const recentReview = mark.Review![mark.Review!.length - 1];
          console.log({ recentReview });
          return (
            recentReview.price >= priceRange.min &&
            recentReview.price <= priceRange.max &&
            mark
          );
        })
        .map((mark: Location) => {
          return (
            <Marker
              key={mark.id}
              longitude={mark.longitude}
              latitude={mark.latitude}
              onClick={() => onMarkerClick(mark)}
            >
              <Image
                className={clsx(
                  styles.guinnessMarker,
                  isAdding && styles.isAdding,
                )}
                src={guinnessArrow.src}
                alt={"Position of Guinness"}
                height={50}
                width={50}
              />
            </Marker>
          );
        }),
    [data, priceRange, isAdding],
  );

  const recentPriceMarkers = useMemo(
    () =>
      data
        ?.filter((mark: Location) => {
          const recentReview = mark.Review![mark.Review!.length - 1];
          console.log({ recentReview });
          return (
            recentReview?.price >= priceRange.min &&
            recentReview?.price <= priceRange.max &&
            mark
          );
        })
        .map((mark: Location) => {
          return (
            <Marker
              key={mark.id}
              longitude={mark.longitude}
              latitude={mark.latitude}
              onClick={() => onMarkerClick(mark)}
            >
              <p className={clsx(styles.price, isAdding && styles.isAdding)}>
                £{mark.Review ? mark!.Review[0]!.price : ""}
              </p>
            </Marker>
          );
        }),
    [data, recentPrice, priceRange, isAdding],
  );

  return (
    <div className={styles.mapContainer}>
      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoiYmFpbGV5YSIsImEiOiJjbHM2NW1scXkxdDhrMmpwY2N5OWNlZm54In0.EWhC5rsaB3nMqz9xHQ1cPQ"
        reuseMaps
        {...viewState}
        style={{ width: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={onMove}
        onClick={onClick}
      >
        {data && markers}
        {recentPrice && recentPriceMarkers}
        <UserMarker />
        <GeolocateControl
          onError={() => {
            alert(
              "An error occured while attempting geolocation. Make sure location services are enabled.",
            );
          }}
        />
      </Map>
    </div>
  );
}
