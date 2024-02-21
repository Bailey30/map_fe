import { Marker } from "react-map-gl";
import { useAppSelector } from "@/redux/hooks";
import { memo, useEffect, useState } from "react";
import Image from "next/image";
import userMarker from "../../../public/images/user.svg"
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./userMarker.module.css"


export const UserMarker = memo(function UserMarker() {

    const viewState = useAppSelector((state) => state.map)
    const [userLocation, setUserLocation] = useState({ latitude: "", longitude: "" })
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setUserLocation({ latitude: position.coords.latitude.toString(), longitude: position.coords.longitude.toString() })
            });
        }
    }, [])
    return (
        <div className={styles.userMarker}>
            <Marker latitude={parseInt(userLocation.latitude)} longitude={parseInt(userLocation.longitude)} >
                <Image src={userMarker} alt={"location of user"} height={30} width={30} />
            </Marker>
        </div>
    )
})
