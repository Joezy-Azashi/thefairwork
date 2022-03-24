import apiInstance from "../../../Services/api"
import * as endpoint from "../endpoints"
import * as actions from './actions'

import {createAsyncThunk} from '@reduxjs/toolkit'
import { async } from "regenerator-runtime";

const api = apiInstance();


// FETCH QUESTIONS WITH RELATIONS TO JOBS
export const postQuestions = createAsyncThunk(actions.ADD_QUESTIONS, async(data) => {
    const response = await api.post(endpoint.addJobQuestionEndpoint, data)
    return response
})

export const fecthJobQuestions = createAsyncThunk(actions.GET_QUESTIONS, async(params) => {
    return await (await api.get((endpoint.fetchQuestionsEndpoint).concat(params) ) )
})