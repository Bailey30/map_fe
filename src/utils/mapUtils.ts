import axios, { AxiosResponse, AxiosError } from "axios"

export function moveCameraTo(map: any, long: number, lat: number) {
    map.current.flyTo({
        center: [long, lat],
        essential: true,
        zoom: 10
    })
}


