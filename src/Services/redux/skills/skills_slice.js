import { createSlice } from "@reduxjs/toolkit";

import * as skills from './index'

const skillsSlice = createSlice({
    name : 'SkillsSlice',
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

    reducers:{

    },

    extraReducers: {
        // TOOLKIT FOR GETTING SKILLS INDUSTRY TYPE FOR FREELANCER
        [skills.getSkillIndustryType.pending] : (state => {
            state.status = "Loading"
            state.loaded = false
        }),
        [skills.getSkillIndustryType.fulfilled] : ((state, action) => {
            state.data = action.payload.data
            state.loaded = true
            state.status = "Loaded successfully"
        }),
        [skills.getSkillIndustryType.rejected] : (state, action) => {
            state.data = []
            state.loaded = false
            state.status = "Failed"
            state.error = action
        },
}
})

export const skillsReducer = ({skills}) => skills
export default skillsSlice.reducer