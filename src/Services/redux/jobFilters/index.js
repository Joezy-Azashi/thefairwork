import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'
import { async } from "regenerator-runtime";

const api = apiInstance();

// ENDOINT FOR FILTERING JOBS BY SEARCH
export const filterJobsBySearch = createAsyncThunk(actions.SEARCH_JOB, async(data) => {
    return api.post((endpoint.jobsFilter).concat(`/${data.page}`), data)
} )


//ENDPOINT FOR FILTERING CLIENT JOBS BY SEARCH
export const filterClientJobsBySearch = createAsyncThunk(actions.SEARCH_JOB, async(data) => {
    return api.post((endpoint.clientFilter ).concat(`/${data.page}`), data)
} )

// ENDOINT FOR FILTERING JOBS BY SEARCH
export const filterLocalJobsRecruiterBySearch = createAsyncThunk(actions.SEARCH_JOB, async(data) => {
    return api.post((endpoint.localJobRecruiterFilter).concat(`/${data.page}`), data)
} )

// ENDOINT FOR FILTERING ADMIN RECRUITER JOBS BY SEARCH
export const filterAdminRecruiterJobsBySearch = createAsyncThunk(actions.SEARCH_JOB, async(data) => {
    return api.post((endpoint. adminRecruiterJob).concat(`/${data.page}`), data)
} )

// ENDOINT FOR FILTERING ADMIN CLIENT JOBS BY SEARCH
export const filterAdminClientJobsBySearch = createAsyncThunk(actions.SEARCH_JOB, async(data) => {
    return api.post((endpoint. adminClientJob).concat(`/${data.page}`), data)
} )




// ENDOINT FOR FILTERING JOBS BY TYPE
export const filterJobsByType = createAsyncThunk(actions.FILTER_JOB_TYPE, async(data, {page = 1}) => {
    return api.get((endpoint.typeJobsFilter).concat(`/?type=${data.type}&page=${page}&userProfileId=${data.useProfileId}`))
})

// ENDOINT FOR FILTERING JOBS BY STATUS
export const filterJobsByStatus = createAsyncThunk(actions.FILTER_JOB_STATUS, async(data, {page = 1}) => {
    return api.get((endpoint.statusJobsFilter).concat(`/?status=${data.status}&page=${page}&userProfileId=${data.useProfileId}`))
})

//ENDPOINT FOR FILTERING BY APPLICANTS
export const filterJobsByApplicants = createAsyncThunk(actions.FIND_APPLICANTS, async(data, {page=1}) => {
    return api.post((endpoint.getApplicants).concat(`${page}`),data)
})

//ENDPONT FOR GETTING RECRUITER JOBS
export const filterGetRecruiterJobs = createAsyncThunk(actions.GET_RECRUITER, async(data) => {
    return api.get((endpoint.getRecruiterJobs).concat(`${data}`))
})
