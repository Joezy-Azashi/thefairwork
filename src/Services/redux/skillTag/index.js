import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from './actions'

import { createAsyncThunk } from '@reduxjs/toolkit'

const api = apiInstance();

// ADD TAGS
export const addTag = createAsyncThunk(actions.ADD_TAG, async(data) => {
    const response = await api.post(endpoint.addingSkillTagsEndpoint, data)
    return response
})

// FETCHING TAGS
export const getTag = createAsyncThunk(actions.GET_TAG, async(data) => {
    const response = await api.get((endpoint.getSkillTagsEndpoint).concat("/"+data) )
    return response
})

// DELETE TAGS
export const deleteTag = createAsyncThunk(actions.DELETE_TAG, async(data) => {
    const response = await api.delete(endpoint.deletingSkillTagsEndpoint, data)
    return response
})
