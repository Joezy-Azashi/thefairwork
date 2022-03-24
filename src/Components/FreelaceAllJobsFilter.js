import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import {
  
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  TextField,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { filterLocalJobsFreelancerBySearch } from "../Services/redux/freelancer-filters/index";
import { freelancerJobFiltersRuducer } from "../Services/redux/freelancer-filters/filters";
import Api from "../Services/api";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { MultiSelect } from "react-multi-select-component";

function FreelanceAllJobsFilter() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [keyword, setkeyword] = useState(null);
  const [sort, setSort] = useState("DESC");
  const [typeArray, setTypeArray] = useState([]);
  const [settingArray, setSettingArray] = useState([]);

  const [industries, setIndustries] = useState([]);
  const [subCategories, setsubCategories] = useState([]);

  const settings = [{"label": "Remote", "value": "Remote"}, {"label": "On-Site", "value": "On-Site"}, {"label": "Hybrid", "value": "Hybrid"}];

  //job type data
  let jobTypes = [{label: "Full-Time", value: "Full-Time"}, {label: "Part-Time", value: "Part-Time"}, {label: "Contract", value: "Contract"}];

  const extractValue = (arrayObj) => {
    let simpeArray = [];
    arrayObj.map(item => simpeArray.push(item.value))
    return simpeArray
  }

  //filter data
  let filterData = {
    keyword: keyword === "" ? null : keyword,
    type: extractValue(typeArray),
    industryId: industry,
    categoryId: category,
    setting: extractValue(settingArray),
    sortBy: sort,
    page: 1,
  };

  const clearFilters = async () => {
    filterData = {
      keyword: null,
      type: [],
      industryId: null,
      categoryId: null,
      setting: [],
      sortBy: "DESC",
      page: 1,
    };
    setkeyword("");
    setIndustry(null);
    setCategory(null);
    setSort("DESC");
    setTypeArray([]);
    setSettingArray([]);
    InitialJobs();
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

    const result = industries.find(({ id }) => id === industryId);
    setsubCategories(result.Industries);
  };

  const filterWithKeyWord = async (e) => {
    setkeyword(e.target.value);
    filterData.keyword = e.target.value;
    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
    
  };

  const filterWithIndustry = async (e) => {
    setIndustry(e.target.value);
    filterData.industryId = e.target.value;
    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  
  };

  const filterWithCategory = async (e) => {
    setCategory(e.target.value);
    if(category === null || category === ""){
    }else{
    filterData.categoryId = e.target.value;
    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
    }
  };

  const filterWithTypeMulti = async (e) => {

    setTypeArray(e);

    filterData.type = extractValue(e)


    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

 

  const filterWithSettingMulti = async (e) => {
    setSettingArray(e);

    filterData.setting = extractValue(e)

    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const filterWithSort = async (e) => {
    setSort(e.target.value);
    filterData.sortBy = e.target.value;
    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {})
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  const InitialJobs = async (e) => {
    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {
        
      })
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  useEffect(() => {
    InitialJobs();
    getIndustries();
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
            label="Search by keyword"
            labelId="search-outlined-label"
            id="search-outlined"
            type="search"
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
            selectSomeItems: "Type"
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
            selectSomeItems: "Work Setting"
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
            label="Industry"
            size="small"
            className=""
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
              return <MenuItem style={{textTransform: "capitalize"}} value={ind.id}>{ind.name}</MenuItem>;
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
            size="small"
            className=""
            select
            value={category}
            fullWidth
            onChange={filterWithCategory}
            style={{ backgroundColor: "white", textTransform: "capitalize" }}
            InputProps={{}}
          >
            {industry === null ? <i style={{margin: "0 10px"}}>Select industry to see categories</i> : subCategories.map((cat) => {
              return <MenuItem style={{textTransform: "capitalize"}} value={cat.id}>{cat.name}</MenuItem>;
            })}
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
    </div>
  );
}

export default FreelanceAllJobsFilter;
