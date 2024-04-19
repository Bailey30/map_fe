import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./slice";
import controlsSlice from "./controlsSlice";
import reviewSlice from "./reviewSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      map: mapSlice,
      controls: controlsSlice,
      review: reviewSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
