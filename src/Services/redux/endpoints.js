/** fetch profile details endpoint **/
export const fetchProfileData = "/users/get-user-profile/"

/** edit profile endpoint **/
export const editProfileData = ""

// END POINT FOR FETCHING ALL JOB QUESTIONS
export const fetchQuestionsEndpoint = '/jobs/get-questions/'

// END POINT FOR ADDING ALL JOB QUESTIONS
export const addJobQuestionEndpoint = '/jobs/post-question'


// END POINT FOR EDITING ALL JOB QUESTIONS
export const editJobQuestionEndpoint = '/jobs/edit-question'

// END POINT FOR ADDING SKILL TAGS
export const addingSkillTagsEndpoint = '/users/tag'

// END POINT FOR GETTING SKILL TAGS
export const getSkillTagsEndpoint = '/users/get-tag'

// END POINT FOR DELETING SKILL TAGS
export const deletingSkillTagsEndpoint = '/users/delete-tag/'

// END POINT FOR DELETING ALL JOB QUESTIONS
export const deleteJobQuestionEndpoint = '/jobs/delete-question'

// END POINT FOR GETTING RECRUITER JOBS
export const getRecruiterJobEndpoint = '/jobs/get-user-jobs/'

// END POINT FOR GETTING LOCAL RECRUITER JOBS
export const getLocalRecruiterJobEndpoint = '/local-job/get-user-jobs/'

// END POINT FOR POSTING JOBS
export const addJobEndpoint = '/jobs/post-job'

// END POINT FOR RECRUITER POSTING JOBS 
export const recruiterJobEndpoint = '/local-job/post-job'

// END POINT FOR RECRUITER EDITING JOBS
export const recruiterEditJobEndpoint = '/local-job/update-job'

//END POINT FOR ARCHIVING LOCAL RECRUITER JOBS
export const archiveLocalRecruiterJob = '/local-job/archive-job'

// END POINT FOR EDITING JOBS
export const editJobEndpoint = '/jobs/update-job'

// END POINT FOR DELETING JOBS
export const deleteJobEndpoint = '/jobs/delete-question'

//END POINT FOR DELETING RECRUITER JOBS
export const deleteRecruiterJob = '/jobs/delete-job'

//END POINT FOR ARCHIVING RECRUITER JOBS
export const archiveRecruiterJob = '/jobs/archive-job'

//END POINT FOR DEACTIVATING JOBS
export const deactivateJob = '/admin/job-status'

//END POINT FOR ARCHIVING GHANA RECRUITER JOBS
export const archiveGhanaJob = '/local-job/archive-job'

// ENDPOINT FOR SEARCHING OF JOBS
export const searchJobsFilter = '/jobs/search-jobs'

//job filter endpoint
export const jobsFilter = '/jobs/job-search-filter'

//client job filter endpoint
export const clientFilter = '/jobs/filter-all-jobs'

//local job filter endpoint
export const localJobRecruiterFilter = '/local-job/recruiter-job'

//admin recruiter job  endpont
export const adminRecruiterJob = '/local-job/freelancer-job'

//admin client job endpoint
export const adminClientJob = '/jobs/job-search-filter'

//local job filter for freelancers endpoint
export const localJobFreelancerFilter = '/local-job/freelancer-job'

// ENDPOINT FOR SEARCHING OF JOBS BY JOB TYPE
export const typeJobsFilter = '/jobs/filter-by-type'

// ENDPOINT FOR SEARCHING OF JOBS BY JOB STATUS
export const statusJobsFilter = '/jobs/filter-by-status'

// END POINT FOR FETCHNG OF FREELANCERS FOR ADMIN DASHBOARD
export const getAdminFreelancers = '/admin/get-users/'

// END POINT FOR FETCHNG OF RECRUITERS FOR ADMIN DASHBOARD
export const getAdminRecruiters = '/admin/get-users/'
    // ENDPOINTS FOR FETCHING OF FREELANCERS FOR ADMIN DASHBOARD

// ENDPOINTS FOR FETCHING OF FREELANCERS TOTALS FOR ADMIN DASHBOARD

// ENDPOINTS FOR FETCHING OF FREELANCERS FOR ADMIN DASHBOARD

// ENDPOINTS FOR FETCHING OF FREELANCERS TOTALS FOR ADMIN DASHBOARD
export const getAdminFreelancerTotal = '/admin/totals/'

// ENDPOINT FOR DELETING OF USERS
export const adminDeleteUser = 'users/delete-user/'
    //ENDPOINT FOR GETTING ALL CATEGORIES
export const getCategories = `admin/categories/`

//ENDPOINT FOR ADDING CATEGORY
export const addCategories = `admin/categories/create/`

//ENDPOINT FOR GETTING APPLICANTS
export const getApplicants = `jobs/view-job-applicants/`

//ENDPOINT FOR GETTING RECRUITER JOBS
export const getRecruiterJobs = `jobs/get-user-jobs-unpaginated/`

//ENDPOINT FOR GETTING SKILLS INDUSTRY TYPE FOR FREELANCER
export const getSkillsIndustyType = `/users/get-skill-type/`

//ENDPOINT FOR POSTING SKILLS INDUSTRY TYPE FOR FREELANCER
export const addSkillsIndustyType = `/users/post-skill-type`

//ENDPOINT FOR GETTING EDUCATION FOR FREELANCER
export const getEducation = `/users/get-user-education/`

//ENDPOINT FOR GETTING EXPERIENCE FOR FREELANCER
export const getExperience = `/users/get-user-experience/`

//ENDPOINT FOR GETTING CERTIFICATE FOR FREELANCER
export const getCertificate = `/users/get-user-certification/`

//ENDPOINT FOR GETTING PORTFOLIO FOR FREELANCER
export const getPortfolio = `/users/get-user-portfolio/`


//ENDPOINT FOR GETTING PORTFOLIO FOR FREELANCER
export const getSkills = `/users/get-user-skills/`


