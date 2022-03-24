import { createSlice } from "@reduxjs/toolkit";

import * as certificate from "./index";

const CertSlice = createSlice({
    name: "CertSlice",
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
        [certificate.getUserCertification.pending]: (state) => {
          state.status = "Loading";
          state.loaded = false;
        },
        [certificate.getUserCertification.fulfilled]: (state, action) => {
          state.data = action.payload.data;
          state.loaded = true;
          state.status = "Loaded successfully";
        },
        [certificate.getUserCertification.rejected]: (state, action) => {
          state.data = [];
          state.loaded = false;
          state.status = "Failed";
          state.error = action;
        },

      },
})

export const certReducer = ({cert}) => cert
export default CertSlice.reducer