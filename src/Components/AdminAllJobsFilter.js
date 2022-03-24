import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import {
  filterAdminRecruiterJobsBySearch,
  filterAdminClientJobsBySearch,
} from "../Services/redux/jobFilters/index";
import { jobFiltersRuducer } from "../Services/redux/jobFilters/jobFilters-slice";
import Api from "../Services/api";
import { getCurrentUser } from "../Services/auth";
import { MultiSelect } from "react-multi-select-component";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName) {
  return {
    fontWeight: "300",
  };
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 350,
  },
}));

function AdminAllJobsFilter() {
  const dispatch = useDispatch();
  const filters = useSelector(jobFiltersRuducer);
  const [category, setCategory] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [keyword, setkeyword] = useState("");
  const [sort, setSort] = useState("DESC");
  const [typeArray, setTypeArray] = useState([]);
  const [settingArray, setSettingArray] = useState([]);
  let jobData = JSON.parse(localStorage.getItem("AdminJobs"));
  const [checkedtype, setCheckedType] = useState(
    jobData?.jobType ? jobData?.jobType : "client"
  );

  //filter data
  let data = {
    keyword: keyword === "" ? null : keyword,
    type: typeArray.map((s) => s.value),
    industryId: null,
    categoryId: industry ? industry : null,
    subcategoryId: category,
    setting: settingArray,
    sortBy: sort,
    jobType: checkedtype,
    userAccountId: getCurrentUser()?.user?.id,
    page: 1,
  };

  const clearFilters = async () => {
    data = {
      keyword: "",
      type: null,
      categoryId: null,
      subcategoryId: null,
      industryId: null,
      sortBy: "DESC",
      jobType: "client",
      userAccountId: getCurrentUser()?.user?.id,
      page: 1,
    };
    setkeyword("");
    setIndustry(null);
    setCategory(null);
    setSort("DESC");
    setCheckedType("client");
    setTypeArray([]);
    setSettingArray([]);
    InitialJobsCondition();
  };

  const filterWithKeyWord = async (e) => {
    setkeyword(e.target.value);
    data.keyword = e.target.value;
    checkedtype === "recruiter"
      ? await dispatch(filterAdminRecruiterJobsBySearch(data))
      : await dispatch(filterAdminClientJobsBySearch(data))
          .then((response) => {})
          .catch((error) => {});
    localStorage.setItem("AdminJobs", JSON.stringify(data));
  };

  const filterWithSort = async (e) => {
    setSort(e.target.value);
    data.sortBy = e.target.value;
    data.page = localStorage.getItem("page");
    data.jobType === "recruiter"
      ? await dispatch(filterAdminRecruiterJobsBySearch(data))
      : await dispatch(filterAdminClientJobsBySearch(data))
          .then((response) => {})
          .catch((error) => {});

    localStorage.setItem("AdminJobs", JSON.stringify(data));
  };

  const filterWithSort2 = async (event) => {
    setCheckedType(event.target.value);
    data.jobType = event.target.value;
    data.jobType === "recruiter"
      ? await dispatch(filterAdminRecruiterJobsBySearch(data))
      : await dispatch(filterAdminClientJobsBySearch(data))
          .then((response) => {})
          .catch((error) => {});
    localStorage.setItem("AdminJobs", JSON.stringify(data));
  };

  const InitialJobsCondition = () => {
    if (data.jobType === "recruiter") {
      InitialJobs();
    } else {
      InitialJobs2();
    }
  };

  const InitialJobs = async (e) => {
    await dispatch(filterAdminRecruiterJobsBySearch(data)).catch((error) => {});
    localStorage.setItem("AdminJobs", JSON.stringify(data));
  };

  const InitialJobs2 = async (e) => {
    await dispatch(filterAdminClientJobsBySearch(data)).catch((error) => {});
    localStorage.setItem("AdminJobs", JSON.stringify(data));
  };

  useEffect(() => {
    InitialJobsCondition();
  }, []);

  return (
    <div className="mb-3" style={{ color: "#707070" }}>
      <div className="d-flex justify-content-between">
        <div>
          <p className="mb-2">
            <b>Filters</b>
          </p>
        </div>
        <div>
          <Button
            className="p-0"
            style={{ color: "#707070" }}
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      </div>
      <hr className="mt-1" />

      <div className="row mt-4">
        <div className="col-md-12">
          <TextField
            labelId="search-outlined-label"
            id="search-outlined"
            type="search"
            label="Search by keyword"
            size="small"
            className="allJobsSearchPlaceholder"
            value={keyword}
            variant="outlined"
            fullWidth
            onChange={filterWithKeyWord}
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
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <p className="mb-0">
            <b>Sort By</b>
          </p>
          <div>
            <RadioGroup
              className="radioGroup "
              value={sort}
              onChange={filterWithSort}
            >
              <div className="sortRadio">
                <FormControlLabel
                  value="DESC"
                  control={
                    <Radio
                      style={{ backgroundColor: "#F7F7F7F7" }}
                      size="small"
                      className="filterRadio"
                    />
                  }
                  label="Newest to old"
                />
                <FormControlLabel
                  value="ASC"
                  control={
                    <Radio
                      style={{ backgroundColor: "#F7F7F7F7" }}
                      size="small"
                      className="filterRadio"
                    />
                  }
                  label="Oldest to new"
                />
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <p className="mb-0">
            <b>Show By Role</b>
          </p>
          <div>
            <RadioGroup
              className="radioGroup "
              value={checkedtype}
              onChange={filterWithSort2}
            >
              <div className="sortRadio">
                <div className=" col-md-12 d-flex justify-content-between radioSpace">
                  <FormControlLabel
                    value="client"
                    control={
                      <Radio
                        style={{ backgroundColor: "#F7F7F7F7" }}
                        size="small"
                        className="filterRadio"
                      />
                    }
                    label="Client Jobs"
                  />

                  <div>
                    <p
                      className="badge search-badge"
                      style={{ marginTop: "17px", paddingTop: "5px" }}
                    >
                      {filters?.data?.clientJobCount}
                    </p>
                  </div>
                </div>
                <div className=" col-md-12 d-flex justify-content-between">
                  <FormControlLabel
                    value="recruiter"
                    control={
                      <Radio
                        style={{ backgroundColor: "#F7F7F7F7" }}
                        size="small"
                        className="filterRadio"
                      />
                    }
                    label="Recruiter Jobs"
                  />
                  <div>
                    <p
                      className="badge search-badge"
                      style={{ marginTop: "17px", paddingTop: "5px" }}
                    >
                      {filters?.data?.recruiterJobCount}
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAllJobsFilter;
