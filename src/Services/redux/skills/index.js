import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from "./actions"

import {createAsyncThunk} from '@reduxjs/toolkit'

const api = apiInstance();


//FETCHING  SKILL INDUSTRY TYPE FOR FREELANCER
export const getSkillIndustryType = createAsyncThunk(actions.GET_INDUSTRY_TYPE, async (data) => {
    const response = await api.get((endpoint.getSkillsIndustyType).concat(data) ) 
    return response
})
