
import { createSlice } from "@reduxjs/toolkit"

type reviewState = {
    imgString: string
}
const initialState = {
    imgString: ""
}
export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        SET_IMG_STRING: (state: reviewState, action) => {
            state.imgString = action.payload
        }
    }
})


export const {
    SET_IMG_STRING
} = reviewSlice.actions

export default reviewSlice.reducer
