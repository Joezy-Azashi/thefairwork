import { createSlice } from "@reduxjs/toolkit";

import * as portfolio from "./index";

const PortSlice = createSlice({
    name: "PortSlice",
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
        [portfolio.getUserPortfolio.pending]: (state) => {
          state.status = "Loading";
          state.loaded = false;
        },
        [portfolio.getUserPortfolio.fulfilled]: (state, action) => {
          state.data = action.payload.data;
          state.loaded = true;
          state.status = "Loaded successfully";
        },
        [portfolio.getUserPortfolio.rejected]: (state, action) => {
          state.data = [];
          state.loaded = false;
          state.status = "Failed";
          state.error = action;
        },

      },
})


export const portReducer = ({port}) => port
export default PortSlice.reducer