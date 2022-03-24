import { createSlice } from "@reduxjs/toolkit";

import * as filters from "./index";

const freelancerJobFilters = createSlice({
  name: "FreelancerJobFilterSlice",
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
    // TOOLKIT FOR FETCHING GHANA JOBS FOR FREELNCERS
    [filters.filterLocalJobsFreelancerBySearch.pending]: (state) => {
      state.loaded = false;
      state.status = "Loading";
    },
    [filters.filterLocalJobsFreelancerBySearch.fulfilled]: (state, action) => {
      state.data = action.payload.data;
      state.loaded = true;
      state.status = "Loaded successfully";
    },
    [filters.filterLocalJobsFreelancerBySearch.rejected]: (state, action) => {
      state.data = [];
      state.loaded = false;
      state.status = "Failed";
      state.error = action;
    },

  },
});

export const freelancerJobFiltersRuducer = ({ freelancerJobFilters }) => freelancerJobFilters;
export default freelancerJobFilters.reducer;
