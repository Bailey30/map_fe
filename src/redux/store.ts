import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./slice"
import controlsSlice from "./controlsSlice";

export const makeStore = () => {

    return configureStore({
        reducer: {
            map: mapSlice,
            controls: controlsSlice,
        }
    })
}

export type AppStore= ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"] 
