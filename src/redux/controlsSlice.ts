import {createSlice} from "@reduxjs/toolkit"

type controlsState = {
    isAdding: boolean
}
const initialState = {
    isAdding: false
}
export const controlsSlice = createSlice({
    name: "controls",
    initialState,
    reducers: {
        TOGGLE_IS_ADDING: (state:controlsState) =>{
            state.isAdding = !state.isAdding
        }
    }
})


export const {
    TOGGLE_IS_ADDING
}= controlsSlice.actions

export default controlsSlice.reducer