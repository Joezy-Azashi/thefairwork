import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { CardContent, Grid, Card } from "@material-ui/core";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mdi/react";
import { InputAdornment, TextField } from "@mui/material";
import { mdiCalendarMonthOutline } from "@mdi/js";
import Api from "../../Services/api";

function generateArrayOfYears() {
  var min = 2021;
  const max = min + 11;
  let years = [];

  for (let i = min; i < max; i++) {
    years.push(i);
  }
  return years;
}


export default function UsersGraph(props) {
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const getYearlyData = async () => {
    Api()
      .get(`admin/dashboard/user-graph/${selectedYear}`)
      .then((response) => {
        setYearlyData(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getYearlyData();
  }, [selectedYear]);

  return (
    <div className="row mb-5 mt-4">
      <div className="col-md-12 mt-2">
        <Card className="fullTable">
          <div className="d-flex justify-content-between UsersgraphHeader">
            <div>
              <h6 className="m-4 usersGraphTitile">Users</h6>
            </div>
            <div className="d-flex align-items-center">
              <div className="m-4 d-flex align-items-center">
                <p className="noOfFreelancer"></p>
                <p className="noOfFreelancerText">No of freelancers</p>
              </div>
              <div className="m-4 d-flex align-items-center">
                <p className="noOfClient"></p>
                <p className="noOfFreelancerText">No of clients</p>
              </div>
              <div className="m-4 d-flex align-items-center">
                <p className="noOfHired"></p>
                <p className="noOfHiredText">No of people hired</p>
              </div>
              <div>
                <div className="col-md-12"></div>

                <TextField
                  sx={{ width: 180, marginRight: 3 }}
                  hiddenLabel={true}
                  variant="outlined"
                  label="Year"
                  size="small"
                  select
                  fullWidth
                  value={selectedYear}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon
                          path={mdiCalendarMonthOutline}
                          size={1}
                          horizontal
                          vertical
                          color="#2e405b"
                          rotate={180}
                        />
                      </InputAdornment>
                    ),
                  }}
                >
                  {generateArrayOfYears().map((year, index) => (
                    <MenuItem key={index} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
          </div>
          <CardContent>
            <Grid
              container
              spacing={3}
              sx={{ justifyContent: "space-between" }}
            >
              <BarChart
                width={window.screen.width >= 1920 ? 1050 : 870}
                height={370}
                data={yearlyData}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="freelancer" fill="#2E405B" />
                <Bar dataKey="recruiter" fill="#FFB648" />
              </BarChart>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
