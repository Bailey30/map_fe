import { createSlice } from "@reduxjs/toolkit";

export type MapState = {
    longitude: number,
    latitude: number,
    zoom: number
}

const initialState: MapState = {
    longitude: -2.244644,
    latitude: 53.483959,
    zoom: 15
}

export const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {
        MOVE_TO: (state: any, action) => {
            state.longitude = action.payload.longitude
            state.latitude = action.payload.latitude
            state.zoom = action.payload.zoom
        }
    }
})

export const {
    MOVE_TO
} = mapSlice.actions

export default mapSlice.reducer
