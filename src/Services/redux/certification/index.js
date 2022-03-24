import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from './actions'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { async } from "regenerator-runtime";

const api = apiInstance();


// GET EDUCATION
export const getUserCertification = createAsyncThunk(actions.GET_CERTIFICATION, async(data) => {
    const response = await api.get((endpoint.getCertificate).concat(data))
    return response
})
