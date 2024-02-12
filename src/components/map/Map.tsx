"use client"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import styles from "./map.module.css"
import { Map, Marker } from "react-map-gl"
import { useDispatch } from "react-redux"
import { MOVE_TO } from "@/redux/slice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import markers, { Markers, useNextCacheMarkers } from "@/utils/markers"

import "mapbox-gl/dist/mapbox-gl.css";
import useMarkers from "@/utils/markers"
import { Review } from "@/utils/types"
import { UserMarker } from "../userMarker/userMarker"

export default function MapComponent({data}:any) {
    const dispatch = useAppDispatch()
    const viewState = useAppSelector((state) => state.map)

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                dispatch(MOVE_TO({ longitude: position.coords.longitude, latitude: position.coords.latitude, zoom: viewState.zoom }))
            });
        } else {
            console.log("geolocation not happenin")
        }

  }, [])

    function onMove(e: any) {
        const { longitude, latitude, zoom } = e.viewState
        dispatch(MOVE_TO({ longitude, latitude, zoom }))
        console.log(e.viewState)
    }

    function onClick(e: any){
        console.log(e)
    }

    const markers = useMemo(() => data?.map((mark: Review) => {
        console.log("mapping over markers")
        return <Marker key={mark.id} longitude={mark.longitude} latitude={mark.latitude} />
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
                <UserMarker/>
            </Map>
        </div>
    )
}
