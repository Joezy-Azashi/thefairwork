import React, { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiBriefcaseSearchOutline,
  mdiBriefcaseClockOutline,
  mdiMagnify,
  mdiSortAscending,
} from "@mdi/js";
import Api from "../../Services/api";
import {  InputAdornment, Button } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ProjectType, ProjectStatus } from "../../Services/validation";
import { useDispatch, useSelector } from "react-redux";
import { jobFiltersRuducer } from "../../Services/redux/jobFilters/jobFilters-slice";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "45ch",
    },
  },
}));

function FreelancerJobFilters({ useProfileId, checkedData }) {
  const dispatch = useDispatch();
  const filters = useSelector(jobFiltersRuducer);
  const [category, setCategory] = useState("");
  const [keyword, setkeyword] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  const classes = useStyles();



  return (
    <div className="row mt-4">
      <div className="col-md-3 mb-3">
        <TextField
          id="search"
          placeholder="Search by job title or keyword"
          label="Search by job title or keyword"
          type="text"
          variant="outlined"
          size="small"
          value={keyword}
          fullWidth
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
      <div className="col-md-2 mb-3">
        <TextField
          id="type"
          type="text"
          variant="outlined"
          label="Type"
          size="small"
          select
          value={type}
          fullWidth
          InputProps={{}}
        >
          {ProjectType().map((type) => {
            return (
              <MenuItem key={type.name} value={type.name}>
                {type.name}
              </MenuItem>
            );
          })}
        </TextField>
      </div>
      <div className="col-md-2 mb-3">
        <TextField
          id="status"
          label="Category"
          type="text"
          variant="outlined"
          size="small"
          select
          value={category}
          fullWidth
          onChange={(e) => setCategory(e.target.value)}
          InputProps={{}}
        >
          {ProjectStatus().map((type) => {
            return (
              <MenuItem key={type.name} value={type.name}>
                {type.name}
              </MenuItem>
            );
          })}
        </TextField>
      </div>
      <div className="col-md-2 mb-3">
        <TextField
          id="status"
          label="Sort"
          type="text"
          variant="outlined"
          size="small"
          select
          value={sort}
          fullWidth
          onChange={(e) => setSort(e.target.value)}
          InputProps={{}}
        >
          {ProjectStatus().map((type) => {
            return (
              <MenuItem key={type.name} value={type.name}>
                {type.name}
              </MenuItem>
            );
          })}
        </TextField>
      </div>
    </div>
  );
}
export default FreelancerJobFilters;
