"use client"
import { useEffect, useMemo } from "react"
import styles from "./map.module.css"
import { Map, Marker } from "react-map-gl"
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

    console.log({ data })
    console.log("build")

    useEffect(() => {
        console.log({ viewState })
    }, [viewState])
    // could move into a hook called useMapControls

    useEffect(() => {
        if ("geolocation" in navigator) {
            // if there is coords stored in session storage - use them 
            // if not - do this 
            const sessionLat = sessionStorage.getItem("latitude")
            const sessionLong = sessionStorage.getItem("longitude")
            if (sessionLat && sessionLong) {
                dispatch(MOVE_TO({ longitude: parseFloat(sessionLong), latitude: parseFloat(sessionLat), zoom: viewState.zoom }))
            } else {

                navigator.geolocation.getCurrentPosition(position => {
                    dispatch(MOVE_TO({ longitude: position.coords.longitude, latitude: position.coords.latitude, zoom: viewState.zoom }))
                });
            }
        } else {
            console.log("geolocation not happenin")
        }
        return () => {
            console.log("RETURN FUNC")
        }

    }, [])

    window.onbeforeunload = function() {
        console.log("before reload")
        sessionStorage.setItem("latitude", String(viewState.latitude))
        sessionStorage.setItem("longitude", String(viewState.longitude))
    }

    function onMove(e: any) {
        const { longitude, latitude, zoom } = e.viewState
        dispatch(MOVE_TO({ longitude, latitude, zoom }))
        console.log(e.viewState)
    }

    function onClick(e: any) {
        console.log(e)
    }

    function onMarkerClick(mark: Location) {
        router.push(`/review/${mark.id}`)
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
            </Map>
        </div>
    )
}
