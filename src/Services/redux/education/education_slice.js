import { createSlice } from "@reduxjs/toolkit";

import * as education from "./index";


const eduSlice = createSlice({
    name: "EduSlice",
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
        // TOOLKIT FOR FETCHING EDUCATION
        [education.getUserEducation.pending]: (state) => {
          state.status = "Loading";
          state.loaded = false;
        },
        [education.getUserEducation.fulfilled]: (state, action) => {
          state.data = action.payload.data;
          state.loaded = true;
          state.status = "Loaded successfully";
        },
        [education.getUserEducation.rejected]: (state, action) => {
          state.data = [];
          state.loaded = false;
          state.status = "Failed";
          state.error = action;
        },

      },
})

export const eduReducer = ({edu }) => edu
export default eduSlice.reducer