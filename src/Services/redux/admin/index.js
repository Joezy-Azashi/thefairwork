import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from "./actions"
import {freelancerAccountType, recruiterAccountType} from "../../../Services/userTypes"

import {createAsyncThunk} from '@reduxjs/toolkit'
import { async } from "regenerator-runtime";

const api = apiInstance();

// FECTCHING OF FREELANCERS FOR ADMIN DASHBOARD
export const getAdminFreelancers = createAsyncThunk(actions.ADMIN_GET_FREELANCERS, async({page = 1, data = freelancerAccountType()}) => {
    const response = await api.get((endpoint.getAdminFreelancers).concat(`${data}/?&page=${page}`))
    return response
})

// FETCHING OF RECRUITERS FOR ADMIN DASHBOARD
export const getAdminRecruiters = createAsyncThunk(actions.ADMIN_GET_RECRUITERS, async({page = 1, data = recruiterAccountType()}) => {
    const response = await api.get((endpoint.getAdminRecruiters.concat(`${data}/?&page=${page}`)))
    return response
})

export const adminDeleteUser = createAsyncThunk(actions.ADMIN_DELETE_USER, async(data) => {
    const response = await api.delete((endpoint.adminDeleteUser.concat(`${data}`)))
})
    
//FETCHING OF CATEGORIES
export const getCategories = createAsyncThunk(actions.GET_CATEGORIES, async () => {
    const response = await api.get((endpoint.getCategories)) 
    return response
})

//ADDING NEW CATEGORY
export const addCategories = createAsyncThunk(actions.ADD_CATEGORIES, async(data) => {
    const response = await api.post((endpoint.addCategories, data))
    return response
})
