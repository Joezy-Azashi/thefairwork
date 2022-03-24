import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from './actions'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { async } from "regenerator-runtime";

const api = apiInstance();


// GET EDUCATION
export const getUserExperience = createAsyncThunk(actions.GET_EXPERIENCE, async(data) => {
    const response = await api.get((endpoint.getExperience).concat(data))
    return response
})
