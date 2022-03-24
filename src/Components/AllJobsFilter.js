import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputAdornment,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import { filterClientJobsBySearch } from "../Services/redux/jobFilters/index";
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

function AllJobsFilter() {
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

  const [industries, setIndustries] = useState([]);
  const [subCategories, setsubCategories] = useState([]);
  const [statusArray, setStatusArray] = useState([
    "Posted",
    "Draft",
    "Archived",
  ]);

  const [postedJobs, setPostedJobs] = useState(
    JSON.parse(localStorage.getItem("postedJob")) || true
  );
  const [draftJobs, setDraftJobs] = useState(
    JSON.parse(localStorage.getItem("draftJob")) || true
  );
  const [archivedJobs, setArchivedJobs] = useState(
    JSON.parse(localStorage.getItem("archivedJob")) || true
  );

  const [allJobs, setAllJobs] = useState(true);

  const checked = [];
  //job type data
  let jobTypes = [
    { label: "1-month", value: "1-month" },
    { label: "3-month", value: "3-month" },
    { label: "6-month", value: "6-month" },
    { label: "12-month", value: "12-month" },
  ];

  const extractValue = (arrayObj) => {
    let simpeArray = [];
    arrayObj.map((item) => simpeArray.push(item.value));
    return simpeArray;
  };
  const hello = () => {
    if (archivedJobs && postedJobs && draftJobs === true) {
      setAllJobs(true);
    }
  };

  const handleClick = () => {
    if (allJobs === false) {
      filterByStatus("All", allJobs);
      localStorage.clear();

      window.location.assign("/all-jobs");
    } else if (allJobs === true) {
      filterByStatus("All", allJobs);
      localStorage.clear();

      window.location.assign("/all-jobs");
    }
  };
  //filter data
  let data = {
    keyword: keyword === "" ? null : keyword,
    type: typeArray.map((s) => s.value),
    categoryId: industry ? industry : null,
    subcategoryId: category,
    setting: settingArray,
    sortBy: sort,
    status: [],
    userAccountId: getCurrentUser()?.user?.id,
    page: 1,
  };

  const clearFilters = async () => {
    data = {
      keyword: null,
      type: [],
      categoryId: null,
      subcategoryId: null,
      status: [],
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
    InitialJobs();
    setDraftJobs(false);
    setPostedJobs(false);
    setArchivedJobs(false);
  };

  const getIndustries = () => {
    Api()
      .get(`admin/categories`)
      .then((response) => {
        setIndustries(response?.data?.reverse());
      })
      .catch((error) => {});
  };

  const filterWithKeyWord = async (e) => {
    setkeyword(e.target.value);
    data.keyword = e.target.value;
    await dispatch(filterClientJobsBySearch(data))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  const filterWithIndustry = async (e) => {
    setIndustry(e.target.value);
    data.categoryId = e.target.value;
    await dispatch(filterClientJobsBySearch(data))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  const filterWithCategory = async (e) => {
    setCategory(e.target.value);
    data.categoryId = e.target.value;
    await dispatch(filterClientJobsBySearch(data))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  const filterWithTypeMulti = async (e) => {
    setTypeArray(e);

    data.type = extractValue(e);

    await dispatch(filterClientJobsBySearch(data))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  const filterWithSort = async (e) => {
    setSort(e.target.value);
    data.sortBy = e.target.value;
    await dispatch(filterClientJobsBySearch(data))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  const filterByStatus = async (statusValue, valueChecked) => {
    let oldStatus = statusArray;
    if (oldStatus.includes("All") && valueChecked != allJobs) {
    }

    if (statusValue === "All") {
      oldStatus = ["Posted", "Archived", "Draft"];
      setPostedJobs(true);
      setArchivedJobs(true);
      setDraftJobs(true);
    } else if (!oldStatus.includes(statusValue) && !valueChecked) {
      oldStatus.push(statusValue);
      setStatusArray(oldStatus);
      data.status = oldStatus;
    } else if (valueChecked) {
      oldStatus = oldStatus.filter((item) => item !== statusValue);
      oldStatus = oldStatus.filter((item) => item !== "All");
      setStatusArray(oldStatus);
      data.status = oldStatus;
    }

    await dispatch(filterClientJobsBySearch(data))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  const InitialJobs = async (e) => {
    await dispatch(filterClientJobsBySearch(data))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  useEffect(() => {
    InitialJobs();
    getIndustries();
    hello();
  }, []);

  return (
    <div className="mb-3" style={{ color: "#707070" }}>
      <div className="d-flex justify-content-between">
        <div>
          <p className="mb-2">
            <b>Filters</b>
          </p>
        </div>
        <div
          style={{ color: "#707070", cursor: "pointer" }}
          onClick={clearFilters}
        >
          <p className="mb-0">Clear all</p>
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

      <div className="row mt-3">
        <div className="col-md-12">
          <TextField
            id="industry"
            type="text"
            variant="outlined"
            className=""
            label="Categories"
            size="small"
            select
            value={industry}
            fullWidth
            onChange={(e) => {
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
                  {ind.category}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
      </div>

      <div className="row mt-3">
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

      <div className="row mt-1">
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
              checked={
                postedJobs === true &&
                archivedJobs === true &&
                draftJobs === true
              }
              onChange={(e) => {
                handleClick();
                setAllJobs(!allJobs);
              }}
            />
            <p style={{ marginTop: "17px" }}>All Jobs</p>
          </div>

          <div>
            <p
              className="badge search-badge"
              style={{ marginTop: "17px", paddingTop: "5px" }}
            >
              {filters?.data?.statusCount?.All}
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
              style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
              checked={postedJobs}
              onChange={(e) => {
                setPostedJobs(!postedJobs);
                setAllJobs(false);
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
              style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
              checked={draftJobs}
              onChange={(e) => {
                setDraftJobs(!draftJobs);
                setAllJobs(false);
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
              style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
              checked={archivedJobs}
              onChange={(e) => {
                setArchivedJobs(!archivedJobs);
                filterByStatus("Archived", archivedJobs);

                setAllJobs(false);
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

export default AllJobsFilter;
