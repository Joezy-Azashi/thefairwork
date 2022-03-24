import React, { useState, useEffect } from "react";
import {
  InputAdornment,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  MenuItem
} from "@mui/material";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import { filterJobsBySearch } from "../Services/redux/jobFilters/index";
import { jobFiltersRuducer } from "../Services/redux/jobFilters/jobFilters-slice";
import Api from "../Services/api";

function SearchJobsFilter() {
  const dispatch = useDispatch();
  const filters = useSelector(jobFiltersRuducer);
  const [category, setCategory] = useState(null);
  const [keyword, setkeyword] = useState(null);
  const [sort, setSort] = useState("DESC");
  const [skillCategories, setskillCategories] = useState([]);
  const [typeArray, setTypeArray] = useState([]);

  //job type data
  let jobTypes = [
    {
      name: "1 month",
      value: "1-month",
      count: filters?.data?.typeCount ? filters?.data?.typeCount["1-month"] : 0,
    },
    {
      name: "3 month",
      value: "3-month",
      count: filters?.data?.typeCount ? filters?.data?.typeCount["3-month"] : 0,
    },
    {
      name: "6 month",
      value: "6-month",
      count: filters?.data?.typeCount ? filters?.data?.typeCount["6-month"] : 0,
    },
    {
      name: "12 month",
      value: "12-month",
      count: filters?.data?.typeCount
        ? filters?.data?.typeCount["12-month"]
        : 0,
    },
  ];

  //filter data
  let filterData = {
    keyword: keyword === "" ? null : keyword,
    categoryId: category,
    type: typeArray,
    sortBy: sort,
    page: 1,
  };

  const clearFilters = async () => {
    filterData = {
      keyword: null,
      categoryId: null,
      type: [],
      sortBy: "DESC",
      page: 1,
    };
    setkeyword("");
    setCategory(null);
    setSort("DESC");
    setTypeArray([]);
    InitialJobs();
  };

  const handleRadioChange = (event) => {
    setSort(event.target.value);
  };

  const filterWithKeyWord = async (e) => {
    setkeyword(e.target.value);
    filterData.keyword = e.target.value;
    await dispatch(filterJobsBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithCategory = async (e) => {
    setCategory(e.target.value);
    filterData.categoryId = e.target.value;
    await dispatch(filterJobsBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithSort = async (e) => {
    setSort(e.target.value);
    filterData.sortBy = e.target.value;
    await dispatch(filterJobsBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithTypeMulti = async (e) => {
    let oldTypeArray = typeArray;
    oldTypeArray.includes(e.target.value)
      ? (oldTypeArray = oldTypeArray.filter((item) => item !== e.target.value))
      : oldTypeArray.push(e.target.value);

    setTypeArray(oldTypeArray);
    filterData.type = oldTypeArray;

    await dispatch(filterJobsBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const InitialJobs = async (e) => {
    await dispatch(filterJobsBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const skillsCategories = () => {
    Api()
      .get(`/users/categories`)
      .then((response) => {
        setskillCategories(response?.data);
      })
      .catch((error) => {});
  };

  const typeInTypeArray = (value) => {
    let exists = false;
    const result = typeArray.find((element) => element === value);
    if (result !== undefined) {
      exists = true;
    }

    return exists;
  };

  useEffect(() => {
    skillsCategories();
    InitialJobs();
    typeInTypeArray("3-month");
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
            id="search"
            type="search"
            variant="outlined"
            label="Search by keyword"
            size="small"
            className="allJobsSearchPlaceholder"
            value={keyword}
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

      <div className="row mt-3">
        <div className="col-md-12">
          <TextField
            id="type"
            type="text"
            variant="outlined"
            label="Category"
            size="small"
            select
            className=""
            value={category}
            fullWidth
            onChange={filterWithCategory}
            style={{ backgroundColor: "white", textTransform: "capitalize" }}
            InputProps={{}}
          >
            {skillCategories.map((cat) => {
              return <MenuItem style={{textTransform: "capitalize"}} value={cat.id}>{cat.category}</MenuItem>;
            })}
          </TextField>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <p>
            <b>Sort by</b>
          </p>
          <div>
          <RadioGroup className="radioGroup " value={sort} onChange={filterWithSort}>
            <div className="sortRadio">
            <FormControlLabel value="DESC" control={<Radio style={{backgroundColor: "#F7F7F7F7"}} size="small" className="filterRadio" />} label="Newest to old" />
            <FormControlLabel value="ASC" control={<Radio style={{backgroundColor: "#F7F7F7F7"}} size="small" className="filterRadio" />} label="Oldest to new" />
            </div>
          </RadioGroup>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <p>
            <b>Job Duration</b>
          </p>
        </div>
      </div>

      {jobTypes.map((type) => {
        return (
          <div className="row">
            <div className="col-md-12 d-flex justify-content-between" style={{marginBottom: "-14px"}}>
              <div className="d-flex">
                <Checkbox
                  type="checkbox"
                  id="new-to-old"
                  size="small"
                  name="type"
                  className="filtercheckbox"
                  style={{ paddingLeft: "0", backgroundColor: "#F7F7F7F7" }}
                  value={type.value}
                  onChange={filterWithTypeMulti}
                  checked={typeInTypeArray(type.value)}
                />
                  <p style={{marginTop: "17px"}}>{type.name}</p>
              </div>

                <p className="badge search-badge" style={{marginTop: "17px", paddingTop: "5px"}}>{type.count}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SearchJobsFilter;
