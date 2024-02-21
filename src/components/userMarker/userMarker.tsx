import { Marker } from "react-map-gl";
import { useAppSelector } from "@/redux/hooks";
import { memo, useEffect, useState } from "react";
import Image from "next/image";
import userMarker from "../../../public/images/user.svg"
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./userMarker.module.css"
import { number } from "zod";


export const UserMarker = memo(function UserMarker() {

    const viewState = useAppSelector((state) => state.map)
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number }>({ latitude: 0, longitude: 0 })
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
            });
        }
    }, [])
    return (
        <div className={styles.userMarker}>
            <Marker latitude={userLocation.latitude} longitude={userLocation.longitude} >
                <Image src={userMarker} alt={"location of user"} height={30} width={30} />
            </Marker>
        </div>
    )
})
