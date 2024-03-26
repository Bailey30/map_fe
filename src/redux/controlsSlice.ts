import { createSlice } from "@reduxjs/toolkit";

type controlsState = {
  isAdding: boolean;
  loading: boolean;
  recentPrice: boolean;
  showControls: boolean;
};
const initialState = {
  isAdding: false,
  loading: false,
  recentPrice: false,
  showControls: false,
};
export const controlsSlice = createSlice({
  name: "controls",
  initialState,
  reducers: {
    TOGGLE_IS_ADDING: (state: controlsState) => {
      state.isAdding = !state.isAdding;
    },
    SET_IS_ADDING: (state: controlsState, action) => {
      state.isAdding = action.payload;
    },
    TOGGLE_LOADING: (state: controlsState) => {
      state.loading = !state.loading;
    },
    SET_LOADING: (state: controlsState, action) => {
      state.loading = action.payload;
    },
    SET_RECENT_PRICE: (state: controlsState, action) => {
      state.recentPrice = action.payload;
    },
    SET_SHOW_CONTROLS: (state: controlsState, action) => {
      state.showControls = action.payload;
    },
  },
});

export const {
  TOGGLE_IS_ADDING,
  SET_IS_ADDING,
  TOGGLE_LOADING,
  SET_LOADING,
  SET_RECENT_PRICE,
  SET_SHOW_CONTROLS,
} = controlsSlice.actions;

export default controlsSlice.reducer;
