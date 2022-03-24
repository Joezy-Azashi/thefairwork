import { createSlice } from "@reduxjs/toolkit";

import * as jobs from "./index";

const jobSlice = createSlice({
  name: "JobSlice",
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
    // TOOLKIT FOR FETCHING OF JOBS
    [jobs.getJob.pending]: (state) => {
      state.status = "Loading";
      state.loaded = false;
    },
    [jobs.getJob.fulfilled]: (state, action) => {
      state.data = action.payload.data;
      state.loaded = true;
      state.status = "Loaded successfully";
    },
    [jobs.getJob.rejected]: (state, action) => {
      state.data = [];
      state.loaded = false;
      state.status = "Failed";
      state.error = action;
    },

    // TOOLKIT FOR FETCHING LOCAL RECRUITER OF JOBS
    [jobs.localGetJob.pending]: (state) => {
      state.status = "Loading";
      state.loaded = false;
    },
    [jobs.localGetJob.fulfilled]: (state, action) => {
      state.data = action.payload.data;
      state.loaded = true;
      state.status = "Loaded successfully";
    },
    [jobs.localGetJob.rejected]: (state, action) => {
      state.data = [];
      state.loaded = false;
      state.status = "Failed";
      state.error = action;
    },

    // TOOLKIT FOR ADDING JOB
    [jobs.postJob.pending]: (state) => {
      state.status = "loading";
    },
    [jobs.postJob.fulfilled]: (state, action) => {
      state.request.status = "Success";
      state.error = null;
      state.data = action.payload.data;
    },
    [jobs.postJob.rejected]: (state, action) => {
      state.request.status = "Failed";
      state.error = action;
      state.status = "Failed";
    },

    // TOOLKIT FOR ADDING LOCAL RECRUITER JOB
    [jobs.localPostJob.pending]: (state) => {
      state.status = "loading";
    },
    [jobs.localPostJob.fulfilled]: (state, action) => {
      state.request.status = "Success";
      state.error = null;
      state.data = action.payload.data;
    },
    [jobs.localPostJob.rejected]: (state, action) => {
      state.request.status = "Failed";
      state.error = action;
      state.status = "Failed";
    },

    // TOOLKIT FOR EDITING JOB
    [jobs.EditJob.pending]: (state) => {
      state.status = "loading";
    },
    [jobs.EditJob.fulfilled]: (state, action) => {
      state.request.status = "Success";
      state.error = null;
      state.data = action.payload.data;
    },
    [jobs.EditJob.rejected]: (state, action) => {
      state.request.status = "Failed";
      state.error = action;
      state.status = "Failed";
    },

    // TOOLKIT FOR EDITING LOCAL RECRUITER JOB
    [jobs.localEditJob.pending]: (state) => {
      state.status = "loading";
    },
    [jobs.localEditJob.fulfilled]: (state, action) => {
      state.request.status = "Success";
      state.error = null;
      state.data = action.payload.data;
    },
    [jobs.localEditJob.rejected]: (state, action) => {
      state.request.status = "Failed";
      state.error = action;
      state.status = "Failed";
    },
  },
});

export const jobsreducer = ({ jobs }) => jobs;
export default jobSlice.reducer;
