"use client"
import { useEffect, useMemo } from "react"
import styles from "./map.module.css"
import { GeolocateControl, Map, Marker } from "react-map-gl"
import { MOVE_TO } from "@/redux/slice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import "mapbox-gl/dist/mapbox-gl.css";
import { UserMarker } from "../userMarker/userMarker"
import { useRouter } from "next/navigation"
import { Location } from "@/utils/types"

interface Props {
    data: Location[] | undefined
}

export default function MapComponent({ data }: Props) {
    const dispatch = useAppDispatch()
    const viewState = useAppSelector((state) => state.map)
    const router = useRouter()


    useEffect(() => {
        // console.log({ viewState })
    }, [viewState])
    //
    // could move into a hook called useMapControls
    useEffect(() => {
        // if there is coords stored in session storage - use them 
        const sessionLat = sessionStorage.getItem("latitude")
        const sessionLong = sessionStorage.getItem("longitude")
        if (sessionLat && sessionLong && sessionLat !== "0" && sessionLong !== "0") {
            dispatch(MOVE_TO({ longitude: parseFloat(sessionLong), latitude: parseFloat(sessionLat), zoom: viewState.zoom }))
        } else {
            if ("geolocation" in navigator) {
                // if not - do this 
                navigator.geolocation.getCurrentPosition(position => {
                    dispatch(MOVE_TO({ longitude: position.coords.longitude, latitude: position.coords.latitude, zoom: viewState.zoom }))
                });
            } else {
                console.log("geolocation not happenin")
            }
        }
    }, [])

    if (typeof window !== "undefined") {
        window.onbeforeunload = function() {
            console.log("before reload")
            sessionStorage.setItem("latitude", String(viewState.latitude))
            sessionStorage.setItem("longitude", String(viewState.longitude))
        }
    }

    function onMove(e: any) {
        const { longitude, latitude, zoom } = e.viewState
        dispatch(MOVE_TO({ longitude, latitude, zoom }))
        // console.log(e.viewState)
    }

    function onClick(e: any) {
        console.log(e)
    }

    function onMarkerClick(mark: Location) {
        router.push(`/location/${mark.id}`)
    }

    const markers = useMemo(() => data?.map((mark: Location) => {
        console.log("mapping over markers")
        return <Marker key={mark.id} longitude={mark.longitude} latitude={mark.latitude} onClick={() => onMarkerClick(mark)}></Marker>
    }), [data])

    return (
        <div className={styles.mapContainer}>
            <Map
                mapboxAccessToken="pk.eyJ1IjoiYmFpbGV5YSIsImEiOiJjbHM2NW1scXkxdDhrMmpwY2N5OWNlZm54In0.EWhC5rsaB3nMqz9xHQ1cPQ"
                reuseMaps
                {...viewState}
                style={{ width: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onMove={onMove}
                onClick={onClick}
            >
                {data && markers}
                <UserMarker />
                <GeolocateControl  onError={()=> {alert("An error occured while attempting geolocation. Make sure location services are enabled.")}}/>
            </Map>
        </div>
    )
}
