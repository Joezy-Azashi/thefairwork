import { createSlice } from "@reduxjs/toolkit";

import * as questions from "./index"

const questionSlice = createSlice({
    name: 'JobQuestionSlice',
    initialState: {
        data: [],
        loaded: false,
        status: null,
        message: null,
        error: null,
        request: {
            status: null
        }
    },

    reducers: {

    },

    extraReducers: {

        // TOOLKIT FOR FETCHING OF JOB QUESTIONS DATA
        [questions.fecthJobQuestions.pending] : (state => {
            state.status = "Loading"
            state.loaded = false
        }),
        [questions.fecthJobQuestions.fulfilled] : ((state, action) => {
            state.data = action.payload.data
            state.loaded = true 
            state.status = "Loaded successfully"
        }),
        [questions.fecthJobQuestions.rejected] : (state, action) => {
            state.data = []
            state.loaded = false
            state.status = "Failed"
            state.error = action
        },

        // TOOLKIT FOR ADDING OF JOB QUESTIONS DATA
        [questions.postQuestions.pending] : (state => {
            state.status = "loading"
        }),
        [questions.postQuestions.fulfilled] : ((state, action) => {
            state.request.status = "Success"
            state.error = null
            state.data = action.payload.data
        }),
        [questions.postQuestions.rejected] : (state, action) => {
            state.request.status = "Failed"
            state.error = action
            state.status = "Failed"
        },
    }
})

export const questionReducer = ({questions}) => questions
export default questionSlice.reducer