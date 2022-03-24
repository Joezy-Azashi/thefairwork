import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import profile from "../redux/profile/profile_slice"
import questions from "../redux/jobQuestions/question_slice"
import jobs from "../redux/postJob/job_slice"
import skillTags from "../redux/skillTag/skill_tag_slice"
import jobFilters from "../redux/jobFilters/jobFilters-slice"
import admin from "../redux/admin/admin_slice"
import freelancerJobFilters from "../redux/freelancer-filters/filters"
import skills from "../redux/skills/skills_slice"
import edu from "../redux/education/education_slice"
import exp from "../redux/experience/experience_slice"
import cert from "../redux/certification/cert_slice"
import port from "../redux/portfolio/port_slice"

const store = configureStore({
    reducer: {
        profile,
        questions,
        jobs,
        jobFilters,
        admin,
        freelancerJobFilters,
        skillTags,
        skills,
        edu,
        exp,
        cert,
        port
    },
    middleware: getDefaultMiddleware({
        serializableCheck:false
    })
})

export default store;