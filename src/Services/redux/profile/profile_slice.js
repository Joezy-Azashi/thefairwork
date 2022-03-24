import {createSlice} from "@reduxjs/toolkit";
import * as profile from './index'

const ProfileSlice = createSlice({
    name: 'ProfileSlice',
    initialState: {
        data: [],
        loaded: false,
        status: null,
        preloader: false,
        alertType: 'success',
        error: null,
        message: null,
    },
    reducers: {
       
    },
    extraReducers: {

        //handle fetch profile request
        [profile.fetchProfileDataWithThunk.pending] : (state => {
            state.preloader = true
            state.status = "Loading..."
            state.loaded = false
            state.message = null
        }),
        [profile.fetchProfileDataWithThunk.fulfilled] : ((state, {payload} )=> {
            state.data = payload.data
            state.preloader = false
            state.status = "Success"
            state.error = null
            state.message = "Data loaded successfully"
        }),
        [profile.fetchProfileDataWithThunk.rejected] : ((state, action) => {
            state.status = "Failed"
            state.preloader = false
            state.error = action
        }),

            //handle edit profile request
            [profile.updateProfiledataWithThunk.pending] : (state => {
                state.request.preloader = true
                state.request.status = "Loading..."
            }),
            [profile.updateProfiledataWithThunk.fulfilled] : (state => {
                state.request.preloader = false
                state.request.status = "Success"
                state.error = null
                state.successMessage.message = 'profile Edited Successfully'
                state.successMessage.alertType = 'success'
                state.successMessage.openAlert = true
            }),
            [profile.updateProfiledataWithThunk.rejected] : ((state, action) => {
                state.request.status = "Failed"
                state.request.preloader = false
                state.error = action
                state.status = "Failed"
            }),
    }
})

export const profileReducer = ({profile}) => profile
export const { handleStateAlert, hanldeSuccesState, handlePreloader, handleStatusUpdate} = ProfileSlice.actions
export default ProfileSlice.reducer