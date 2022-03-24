import { createSlice } from "@reduxjs/toolkit";

import * as filters from "./index";

const jobFilters = createSlice({
  name: "JobFilterSlice",
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
    // // TOOLKIT FOR FETCHING GHANA JOBS FOR FREELNCERS
    // [filters.filterLocalJobsFreelancerBySearch.pending]: (state) => {
    //   state.loaded = false;
    //   state.status = "Loading";
    // },
    // [filters.filterLocalJobsFreelancerBySearch.fulfilled]: (state, action) => {
    //   state.data = action.payload.data;
    //   state.loaded = true;
    //   state.status = "Loaded successfully";
    // },
    // [filters.filterLocalJobsFreelancerBySearch.rejected]: (state, action) => {
    //   state.data = [];
    //   state.loaded = false;
    //   state.status = "Failed";
    //   state.error = action;
    // },
    // TOOLKIT FOR FETCHING JOBS BY SEARCH TEXTBOX
    [filters.filterJobsBySearch.pending]: (state) => {
      state.loaded = false;
      state.status = "Loading";
    },
    [filters.filterJobsBySearch.fulfilled]: (state, action) => {
      state.data = action.payload.data;
      state.loaded = true;
      state.status = "Loaded successfully";
    },
    [filters.filterJobsBySearch.rejected]: (state, action) => {
      state.data = [];
      state.loaded = false;
      state.status = "Failed";
      state.error = action;
    },

    // TOOLKIT FOR FILTERING JOBS BY JOB TYPE
    [filters.filterJobsByType.pending]: (state) => {
      state.loaded = false;
      state.status = "Loading";
    },
    [filters.filterJobsByType.fulfilled]: (state, action) => {
      state.data = [];
      state.data = action.payload.data;
      state.loaded = true;
      state.status = "Loaded successfully";
    },
    [filters.filterJobsByType.rejected]: (state, action) => {
      state.data = [];
      state.loaded = false;
      state.status = "Failed";
      state.error = action;
    },

    // TOOLKIT FOR FILTERING JOBS BY JOB STATUS
    [filters.filterJobsByStatus.pending]: (state) => {
      state.loaded = false;
      state.status = "Loading";
    },
    [filters.filterJobsByStatus.fulfilled]: (state, action) => {
      state.data = action.payload.data;
      state.loaded = true;
      state.status = "Loaded successfully";
    },
    [filters.filterJobsByStatus.rejected]: (state, action) => {
      state.data = [];
      state.loaded = false;
      state.status = "Failed";
      state.error = action;
    },
  },
});

export const jobFiltersRuducer = ({ jobFilters }) => jobFilters;
export default jobFilters.reducer;
