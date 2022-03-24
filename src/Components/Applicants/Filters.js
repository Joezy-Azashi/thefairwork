import { InputAdornment} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mdi/react";
import { mdiMagnify, mdiPlusThick } from "@mdi/js";
import { useEffect, useState } from "react";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { Pagination } from "@material-ui/lab";
import ApplicantsCard from "./ApplicantsCard";
import { set } from "js-cookie";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "rgb(232, 241, 250)",
  },
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

const Filters = ({ id }) => {
  const classes1 = usePageStyles();
  const classes = useStyles();

  const [pageLength, setpageLength] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applicantMessage, setApplicantMessage] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [skilla, setSkilla] = useState(false);
  const [expanded, setExpanded] = useState();
  const [selectApplicants, setSelectApplicants] = useState();
  const [hiddenfield, setHiddenField] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [search, setSearched] = useState("");
  const [recruiterData, setRecruiterData] = useState([]);
  const [noData, setNodata] = useState();

  const history = useHistory();
  const dispatch = useDispatch();

  const handleFocus = () => {
    setSkilla(true);
  };

  

  const handleSort = (e) => {
    setSelectApplicants(e.target.value);
  };

  return (
    <div>
      <div className="d-flex justify-content-between mt-4">
        <div>
          <p className="mb-0">
            <b>Filters</b>
          </p>
        </div>
      </div>
      <hr className="mt-1" />
      <div className="row mt-3">
        <div className="col-md-12 mb-3">
          <TextField
            id="search"
            placeholder="Search job title or keyword"
            label="Search job title or keyword"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            className=" allJobsSearchPlaceholder pt-1"
            style={{ backgroundColor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon
                    path={mdiMagnify}
                    size={1}
                    horizontal
                    vertical
                    color="#808080"
                    rotate={180}
                  />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="row mt-3">
          <div className="col-md-12 mb-3">
            <TextField
              variant="outlined"
              select
              value={selectApplicants}
              onChange={handleSort}
              label={skilla ? "Sort by job title" : selectApplicants?.title}
              fullWidth
              size="small"
              className="pt-1"
              style={{ backgroundColor: "white" }}
            >
              {recruiterData.map((recruiter) => (
                <MenuItem value={recruiter.id} key={recruiter.id}>
                  {recruiter.title}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
        <div className="row mt-4">
          {!isReady && (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          )}
          {applicantMessage.message === "No Applicants found." && (
            <p className="text-center mt-3">No applicants at the moment</p>
          )}
          {applicants &&
            applicants.map((applicant) => (
              <ApplicantsCard applicant={applicant} />
            ))}
        </div>

        <div className="d-flex justify-content-center mt-5 mb-5">
          <Pagination
            count={pageLength?.length}
            variant="outlined"
            page={pageNumber}
            classes={{ ul: classes1.ul }}
            color="white"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
