import { createSlice } from "@reduxjs/toolkit";

import * as admin from './index'

const adminSlice = createSlice({
    name : 'AdminSlice',
    initialState: {
        data: [],
        loaded: false,
        status: null,
        message: null,
        error: null,
        request: {
            status: null
        }
    },

    reducers:{

    },

    extraReducers: {
            // TOOLKIT FOR FETCHING OF ADMIN FREELANCERS
            [admin.getAdminFreelancers.pending] : (state => {
                state.status = "Loading"
                state.loaded = false
            }),
            [admin.getAdminFreelancers.fulfilled] : ((state, action) => {
                state.data = action.payload.data
                state.loaded = true
                state.status = "Loaded successfully"
            }),
            [admin.getAdminFreelancers.rejected] : (state, action) => {
                state.data = []
                state.loaded = false
                state.status = "Failed"
                state.error = action
            },

              // TOOLKIT FOR FETCHING OF ADMIN RECRUITERS
              [admin.getAdminRecruiters.pending] : (state => {
                state.status = "Loading"
                state.loaded = false
            }),
            [admin.getAdminRecruiters.fulfilled] : ((state, action) => {
                state.data = action.payload.data
                state.loaded = true
                state.status = "Loaded successfully"
            }),
            [admin.getAdminRecruiters.rejected] : (state, action) => {
                state.data = []
                state.loaded = false
                state.status = "Failed"
                state.error = action
            },
    }

})

export const adminReducer = ({admin}) => admin
export default adminSlice.reducer