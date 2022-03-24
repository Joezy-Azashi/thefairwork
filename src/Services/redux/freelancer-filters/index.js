import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'
import { async } from "regenerator-runtime";

const api = apiInstance();


// ENDOINT FOR FILTERING FREELANCER LOCAL JOBS BY SEARCH
export const filterLocalJobsFreelancerBySearch = createAsyncThunk(actions.LOCAL_SERACH, async(data) => {
    return api.post((endpoint.localJobFreelancerFilter).concat(`/${data.page}`), data)
} )