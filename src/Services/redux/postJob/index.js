import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from './actions'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { async } from "regenerator-runtime";

const api = apiInstance();

// POST JOBS
export const postJob = createAsyncThunk(actions.ADD_JOB, async(data) => {
    const response = await api.post(endpoint.addJobEndpoint, data)
    return response
})

// LOCAL RECRUITER POST JOBS
export const localPostJob = createAsyncThunk(actions.LOCAL_ADD_JOB, async(data) => {
    const response = await api.post(endpoint.recruiterJobEndpoint, data)
    return response
})

// EDIT JOBS
export const EditJob = createAsyncThunk(actions.EDIT_JOB, async(data) => {
    const response = await api.put(endpoint.editJobEndpoint, data)
    return response
})

// EDIT LOCAL RECRUITER JOBS
export const localEditJob = createAsyncThunk(actions.LOCAL_EDIT_JOB, async(data) => {
    const response = await api.put(endpoint.recruiterEditJobEndpoint, data)
    return response
})

// FETCH JOBS
export const getJob = createAsyncThunk(actions.GET_JOB, async({ page = 1, data }) => {
    const response = await api.get((endpoint.getRecruiterJobEndpoint).concat(`${data}/?&page=${page}`))
    return response
})

// FETCH LOCAL RECRUITER JOBS
export const localGetJob = createAsyncThunk(actions.LOCAL_GET_JOB, async({ page = 1, data }) => {
    const response = await api.get((endpoint.getLocalRecruiterJobEndpoint).concat(`${data}/?&page=${page}`))
    return response
})


// DELETE JOBS
export const deleteJob = createAsyncThunk(actions.DELETE_JOB, async(data) => {
    const response = await api.delete(endpoint.deleteJobEndpoint, data)
    return response
})

// ARCHIVING JOBS
export const archiveRecruiterJob = createAsyncThunk(actions.ARCHIVE_JOB, async(data) => {
    const response = await api.put(endpoint.archiveRecruiterJob, data)
    return response
})

//DEACTIVATING JOBS
export const deactivateJob = createAsyncThunk(actions.ARCHIVE_JOB, async(data) => {
    const response = await api.put(endpoint.deactivateJob, data)
    return response
})

 // ARCHIVING GHANA JOBS
export const archiveGhanaJob = createAsyncThunk(actions.ARCHIVE_JOB, async(data) => {
    const response = await api.put(endpoint.archiveGhanaJob, data)
    return response
}) 


// ARCHIVING LOCAL RECRUITER JOBS
export const archiveLocalRecruiterJob = createAsyncThunk(actions.LOCAL_ARCHIVE_JOB, async(data) => {
    const response = await api.put(endpoint.archiveLocalRecruiterJob, data)
    return response
})


//DELETE RECRUITER JOBS
export const deleteRecruiterJob = createAsyncThunk(actions.DELETE_RECRUITER_JOB, async(data) => {
    const response = await api.delete(endpoint.deleteRecruiterJob, data)
    return response
})