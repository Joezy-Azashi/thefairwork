import apiInstance from '../../api';
import * as endpoint from '../endpoints'
import * as actions from './action'
import {createAsyncThunk} from '@reduxjs/toolkit'

const api = apiInstance();

//fetch profile data
export const fetchProfileDataWithThunk = createAsyncThunk(actions.GET_PROFILE, async(data) => {
    return api.get(endpoint.fetchProfileData.concat(data))
})

//edit profile data
export const updateProfiledataWithThunk = createAsyncThunk(actions.EDIT_PROFILE, async(data) => {
    return api.patch(endpoint.editProfileData, data)
})