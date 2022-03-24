import { createSlice } from "@reduxjs/toolkit";

import * as experience from "./index";

const ExpSlice = createSlice({
    name: "ExpSlice",
    initialState: {
      data: [],
      loaded: false,
      status: null,
      message: null,
      error: null,
      request: {
        status: null,
      },
    },
    reducers: {},

    extraReducers: {
        // TOOLKIT FOR FETCHING EXPERIENCE
        [experience.getUserExperience.pending]: (state) => {
          state.status = "Loading";
          state.loaded = false;
        },
        [experience.getUserExperience.fulfilled]: (state, action) => {
          state.data = action.payload.data;
          state.loaded = true;
          state.status = "Loaded successfully";
        },
        [experience.getUserExperience.rejected]: (state, action) => {
          state.data = [];
          state.loaded = false;
          state.status = "Failed";
          state.error = action;
        },

      },
})

export const expReducer = ({exp}) => exp
export default ExpSlice.reducer