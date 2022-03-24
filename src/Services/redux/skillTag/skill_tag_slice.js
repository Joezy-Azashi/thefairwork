import { createSlice } from "@reduxjs/toolkit";

import * as skillTags from "./index";

const skillTagSlice = createSlice({
  name: "SkillTagSlice",
  initialState: {
    data: [],
    loaded: false,
    status: null,
    message: null,
    errrors: null,
    request: {
      status: null,
    },
  },

  request: {},

  extraReducers: {
    // TOOLKIT FOR ADDING SKILL TAGS
    [skillTags.addTag.pending]: (state) => {
      state.status = "loading";
    },
    [skillTags.addTag.fulfilled]: (state, action) => {
      state.request.status = "Success";
      state.error = null;
      state.data = action.payload.data;
    },
    [skillTags.addTag.rejected]: (state, action) => {
      state.request.status = "Failed";
      state.error = action;
      state.status = "Failed";
    },

    // TOOLKIT FOR FETCHING SKILL TAGS
    [skillTags.getTag.pending]: (state) => {
      state.status = "loading";
      state.loaded = false;
    },
    [skillTags.getTag.fulfilled]: (state, action) => {
      state.request.status = "Success";
      state.error = null;
      state.data = action.payload.data;
    },
    [skillTags.getTag.rejected]: (state, action) => {
      state.request.status = "Failed";
      state.error = action;
      state.status = "Failed";
    },
  },
});

export const skilltagereducer = ({ skillTags }) => skillTags;
export default skillTagSlice.reducer;
