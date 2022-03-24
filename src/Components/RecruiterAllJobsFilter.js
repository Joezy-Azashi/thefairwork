import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputAdornment,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  MenuItem,
} from "@mui/material";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import { filterLocalJobsRecruiterBySearch } from "../Services/redux/jobFilters/index";
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

function RecruiterAllJobsFilter() {
  const classes = useStyles();
  const [type, setType] = useState([]);
  const dispatch = useDispatch();
  const filters = useSelector(jobFiltersRuducer);
  const [category, setCategory] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [keyword, setkeyword] = useState(null);
  const [sort, setSort] = useState("DESC");
  const [typeArray, setTypeArray] = useState([]);
  const [settingArray, setSettingArray] = useState([]);
  const [statusArray, setStatusArray] = useState(["Posted","Draft","Archived"]);
  const [disabled,setDisabled] = useState(false)

  const [industries, setIndustries] = useState([]);
  const [subCategories, setsubCategories] = useState([]);

  const [allJobs, setAllJobs] = useState( true );
  const [postedJobs, setPostedJobs] = useState(
    JSON.parse(localStorage.getItem("postedJob")) || true
  );
  const [draftJobs, setDraftJobs] = useState(
    JSON.parse(localStorage.getItem("draftJob")) || true
  );
  const [archivedJobs, setArchivedJobs] = useState(
    JSON.parse(localStorage.getItem("archivedJob")) || true
  );

  const settings = [
    { label: "Remote", value: "Remote" },
    { label: "On-Site", value: "On-Site" },
    { label: "Hybrid", value: "Hybrid" },
  ];

  //job type data
  let jobTypes = [
    { label: "Full-Time", value: "Full-Time" },
    { label: "Part-Time", value: "Part-Time" },
    { label: "Contract", value: "Contract" },
  ];

  const extractValue = (arrayObj) => {
    let simpeArray = [];
    arrayObj.map((item) => simpeArray.push(item.value));
    return simpeArray;
  };

  //fiter set
  const filterSet = [];

  const handleClick = () =>{
    if(allJobs === false ) {
     
      filterByStatus("All",allJobs)
     
      localStorage.clear();
      window.location.assign("/recruiter-all-jobs")
    
    } else if(allJobs === true){
      filterByStatus("All",allJobs)
      localStorage.clear();
      window.location.assign("/recruiter-all-jobs")
    }
  }
 
  const removeArchivedFilters = () => {
    localStorage.setItem("archivedJob", JSON.stringify(archivedJobs));
    localStorage.setItem("allJob", JSON.stringify(allJobs));
    if (archivedJobs && !filterSet.includes("Archived")) {
      filterSet.push("Archived");
    } else if (!archivedJobs && filterSet.includes("Archived")) {
      filterSet.splice(filterSet.indexOf("Archived", 1));
    }
  };

  const removePostedFilters = () => {
    localStorage.setItem("postedJob", JSON.stringify(postedJobs));
    if (postedJobs && !filterSet.includes("Posted")) {
      filterSet.push("Posted");
    } else if (!postedJobs && filterSet.includes("Posted")) {
      filterSet.splice(filterSet.indexOf("Posted", 1));
    }
  };

  const removeDraftFilters = () => {
    localStorage.setItem("draftJob", JSON.stringify(draftJobs));
    if (draftJobs && !filterSet.includes("Draft")) {
      filterSet.push("Draft");
    } else if (!draftJobs && filterSet.includes("Draft")) {
      filterSet.splice(filterSet.indexOf("Draft", 1));
    }
  };

  //filter data
  let filterData = {
    keyword: keyword === "" ? null : keyword,
    type: typeArray,
    industryId: industry,
    categoryId: category,
    setting: settingArray,
    sortBy: sort,
    status: [],
    userAccountId: getCurrentUser()?.user?.id,
    page: 1,
  };

  const clearFilters = async () => {
    filterData = {
      keyword: null,
      type: [],
      industryId: null,
      status: [],
      categoryId: null,
      setting: [],
      sortBy: "DESC",
      userAccountId: getCurrentUser()?.user?.id,
      page: 1,
    };
    setkeyword("");
    setIndustry(null);
    setCategory(null);
    setSort("DESC");
    setTypeArray([]);
    setSettingArray([]);
    setStatusArray([]);
    InitialJobs();
    setDraftJobs(false);
    setPostedJobs(false);
    setArchivedJobs(false);
  };

  const getIndustries = () => {
    Api()
      .get(`/admin/industries`)
      .then((response) => {
        setIndustries(response?.data);
      })
      .catch((error) => {});
  };

  const getSubCategory = (industryId) => {
    // setCategory(industryId);
    const result = industries.find(({ id }) => id === industryId);
    setsubCategories(result.Industries);
  };

  const filterWithKeyWord = async (e) => {
    setkeyword(e.target.value);
    filterData.keyword = e.target.value;
    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithIndustry = async (e) => {
    setIndustry(e.target.value);
    filterData.industryId = e.target.value;
    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithCategory = async (e) => {
    setCategory(e.target.value);
    if(category === null || category === ""){
    }else{
    filterData.categoryId = e.target.value;
    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  }
  };

  const filterWithTypeMulti = async (e) => {
    setTypeArray(e);
    filterData.type = extractValue(e);

    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithSettingMulti = async (e) => {
    setSettingArray(e);

    filterData.setting = extractValue(e);

    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithRadio = async () => {
    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithSort = async (e) => {
    setSort(e.target.value);
    filterData.sortBy = e.target.value;
    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterByStatus = async (statusValue, valueChecked) => {
    let oldStatus = statusArray;
    if(oldStatus.includes("All") && valueChecked != allJobs){
    }

    if(statusValue === 'All'){
      oldStatus = ["Posted","Archived","Draft"]
      setPostedJobs(true)
      setArchivedJobs(true)
      setDraftJobs(true)
    }else if (!oldStatus.includes(statusValue) && !valueChecked) {
      oldStatus.push(statusValue);
      setStatusArray(oldStatus);
  
      filterData.status = oldStatus;
    }else if (valueChecked) {
     
      oldStatus = oldStatus.filter((item) => item !== statusValue);
      oldStatus = oldStatus.filter((item) => item !== "All");
      
      setStatusArray(oldStatus);
      filterData.status = oldStatus;
    }

    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const InitialJobs = async (e) => {
    await dispatch(filterLocalJobsRecruiterBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  useEffect(() => {
    InitialJobs();
    getIndustries();
    removeArchivedFilters();
    removePostedFilters();
    removeDraftFilters();
    filterData.status =
      allJobs === true ? null : filterSet.length === 0 ? ["Error"] : filterSet;

    filterWithRadio();
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

      <div className="row mt-3">
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

      {/* new type array */}
      <div className="row mt-3">
        <div className="col-md-12">
          <MultiSelect
            options={jobTypes}
            value={typeArray}
            onChange={filterWithTypeMulti}
            labelledBy="Type"
            overrideStrings={{
              selectSomeItems: "Type",
            }}
            labelledBy={"Type"}
            className="selectHeight"
          />
        </div>
      </div>

      {/* new sett */}
      <div className="row mt-3">
        <div className="col-md-12">
          <MultiSelect
            options={settings}
            value={settingArray}
            onChange={filterWithSettingMulti}
            labelledBy="Work Setting"
            overrideStrings={{
              selectSomeItems: "Work Setting",
            }}
            labelledBy={"Work Setting"}
            className="selectHeight"
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <TextField
            id="industry"
            type="text"
            variant="outlined"
            className=""
            label="Industry"
            size="small"
            select
            value={industry}
            fullWidth
            onChange={(e) => {
              getSubCategory(e.target.value);
              filterWithIndustry(e);
            }}
            style={{ backgroundColor: "white", textTransform: "capitalize" }}
            InputProps={{}}
          >
            {industries.map((ind) => {
              return (
                <MenuItem
                  style={{ textTransform: "capitalize" }}
                  value={ind.id}
                >
                  {ind.name}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <TextField
            id="category"
            type="text"
            variant="outlined"
            label="Category"
            className=""
            size="small"
            select
            value={category}
            fullWidth
            onChange={filterWithCategory}
            style={{ backgroundColor: "white", textTransform: "capitalize" }}
          >
            {industry === null ? (
              <i style={{ margin: "0 10px" }}>
                Select industry to see categories
              </i>
            ) : (
              subCategories.map((cat) => {
                return (
                  <MenuItem
                    style={{ textTransform: "capitalize" }}
                    value={cat.id}
                  >
                    {cat.name}
                  </MenuItem>
                );
              })
            )}
          </TextField>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <p className="mb-0">
            <b>Sort by</b>
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

      <div className="row mt-3">
        <div className="col-md-12">
          <p className="mb-0">
            <b>Job Status</b>
          </p>
        </div>
      </div>

      <div className="row">
        <div
          className="col-md-12 d-flex justify-content-between"
          style={{ marginBottom: "-14px" }}
        >
          <div className="d-flex">
            <Checkbox
              type="checkbox"
              id="new-to-old"
              size="small"
              name="type"
              className="filtercheckbox"
              style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
              checked={postedJobs === true && archivedJobs === true && draftJobs === true}
              onChange={(e) => {
                setAllJobs(!allJobs);
                
                handleClick()
              }}
            />
            <p style={{ marginTop: "17px" }}>All Jobs</p>
          </div>

          <div>
            <p
              className="badge search-badge"
              style={{ marginTop: "17px", paddingTop: "5px" }}
            >
              {filters?.data?.statusCount?.All
                ? filters?.data?.statusCount?.All
                : 0}
            </p>
          </div>
        </div>

        <div
          className="col-md-12 d-flex justify-content-between"
          style={{ marginBottom: "-14px" }}
        >
          <div className="d-flex">
            <Checkbox
              id="new-to-old"
              size="small"
              name="type"
              className="filtercheckbox"
              style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
              checked={postedJobs}
              disabled={disabled}
              onChange={(e) => {
               
                setPostedJobs(!postedJobs);
                filterByStatus("Posted", postedJobs);
              }}
            />
            <p style={{ marginTop: "17px" }}>Current Jobs</p>
          </div>

          <div>
            <p
              className="badge search-badge"
              style={{ marginTop: "17px", paddingTop: "5px" }}
            >
              {filters?.data?.statusCount?.Current
                ? filters?.data?.statusCount?.Current
                : 0}
            </p>
          </div>
        </div>

        <div
          className="col-md-12 d-flex justify-content-between"
          style={{ marginBottom: "-14px" }}
        >
          <div className="d-flex">
            <Checkbox
              type="checkbox"
              id="new-to-old"
              size="small"
              name="type"
              className="filtercheckbox"
              disabled={disabled}
              style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
              checked={draftJobs}
              onChange={(e) => {
                setDraftJobs(!draftJobs);
                filterByStatus("Draft", draftJobs);
              }}
            />
            <p style={{ marginTop: "17px" }}>Drafts</p>
          </div>

          <div>
            <p
              className="badge search-badge"
              style={{ marginTop: "17px", paddingTop: "5px" }}
            >
              {filters?.data?.statusCount?.Draft
                ? filters?.data?.statusCount?.Draft
                : 0}
            </p>
          </div>
        </div>

        <div className="col-md-12 d-flex justify-content-between">
          <div className="d-flex">
            <Checkbox
              type="checkbox"
              id="new-to-old"
              size="small"
              name="type"
              className="filtercheckbox"
              disabled={disabled}
              style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
              checked={archivedJobs}
              onChange={(e) => {
                setArchivedJobs(!archivedJobs);
                filterByStatus("Archived", archivedJobs);
           
              }}
            />
            <p style={{ marginTop: "17px" }}>Archived Jobs</p>
          </div>

          <div>
            <p
              className="badge search-badge"
              style={{ marginTop: "17px", paddingTop: "5px" }}
            >
              {filters?.data?.statusCount?.Archived
                ? filters?.data?.statusCount?.Archived
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterAllJobsFilter;
