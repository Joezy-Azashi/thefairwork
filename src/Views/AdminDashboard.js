import React, { useState, useEffect } from "react";
import { Typography, Card, makeStyles, Fade, Zoom } from "@material-ui/core";

import Api from "../Services/api";
import {
  mdiAccountOutline,
  mdiAccountGroupOutline,
  mdiAccountSupervisorOutline,
  mdiFileDocumentMultipleOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import {
  freelancerAccountType,
  recruiterAccountType,
} from "../Services/userTypes";
import UsersGraph from "../Components/Admin/UsersGraph";
import { withStyles } from "@material-ui/styles";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    marginTop: 200,
  },
}));

function AdminDashboard() {
  const [freelancerAcount, setfreelancerAcount] = useState(
    freelancerAccountType
  );
  const [recruiterAccount, setrecruiterAccount] =
    useState(recruiterAccountType);
  const [dataSummmary, setDataSummary] = useState([]);
  const [recruiterTotals, setrecruiterTotals] = useState([]);
  const [freelancersTotal, setfreelancerTotals] = useState(0);
  const client = dataSummmary?.num_of_clients;
  const freelancers = dataSummmary?.num_of_freelancers;
  const jobPosted = dataSummmary?.num_of_jobs;
  const newRequests = dataSummmary?.num_of_team_requests;
  const totalJobsPosted = jobPosted?.local + jobPosted?.foreign;
  const totalClients = client?.local + client?.foreign;

  const getFreelancerTotals = async () => {
    Api()
      .get(`/admin/totals/${freelancerAcount}`)
      .then((response) => {
        setfreelancerTotals(response?.data?.count);
      })
      .catch((error) => {});
  };

  const getAdminDashboardSummary = async () => {
    Api()
      .get(`/admin/dashboard/summary`)
      .then((response) => {
        setDataSummary(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getAdminDashboardSummary();
    getFreelancerTotals();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-md-12 pageTitle">
          <h6>
            <b>Dashboard</b>
          </h6>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-3 mb-4">
          <LightTooltip
            title={
              <div className="p-2">
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="activeFreelancer"></p>{" "}
                    <p style={{ fontSize: "16px" }}>Active</p>
                  </div>
                  <div>{freelancers?.active ? freelancers?.active : 0}</div>
                </div>
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="deactivated"></p>
                    <p> Deactivated</p>
                  </div>
                  <div>
                    {freelancers?.deactivated ? freelancers?.deactivated : 0}
                  </div>
                </div>
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="hired"></p> <p>Currently hired</p>
                  </div>
                  <div>{freelancers?.hired ? freelancers?.hired : 0}</div>
                </div>
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="available"></p> <p>Currently available</p>
                  </div>
                  <div>
                    {freelancers?.available ? freelancers?.available : 0}
                  </div>
                </div>
              </div>
            }
          >
            <Card>
              <div className="adminDashboardSummaryContainerMobile">
                <div className="d-flex align-items-center">
                  <div className="adminFreelancerDBIcon">
                    <Icon
                      path={mdiAccountOutline}
                      title=""
                      size={1.5}
                      horizontal
                      vertical
                      rotate={180}
                      color="#2E405B"
                    />
                  </div>
                  <Typography className="adminTopentryTextNumber" variant="h4">
                    <b>{freelancersTotal ? freelancersTotal : 0}</b>
                  </Typography>
                </div>
                <section className="m-1 text-align-center">
                  <Typography className="adminTopentryText" variant="subtitle1">
                    <b className="adminDashboardTotalsText">Freelancers</b>
                  </Typography>
                </section>
              </div>
              <div className="adminDashboardSummaryContainer">
                <div className="adminFreelancerDBIcon mt-2 ">
                  <Icon
                    path={mdiAccountOutline}
                    title=""
                    size={1.5}
                    horizontal
                    vertical
                    rotate={180}
                    color="#2E405B"
                  />
                </div>
                <section className="">
                  <Typography className="adminTopentryTextNumber" variant="h4">
                    <b>{freelancersTotal ? freelancersTotal : 0}</b>
                  </Typography>
                  <Typography className="adminTopentryText" variant="subtitle1">
                    <b className="adminDashboardTotalsText">Freelancers</b>
                  </Typography>
                </section>
              </div>
            </Card>
          </LightTooltip>
        </div>
        <div className="col-md-3 mb-4">
          <LightTooltip
            TransitionComponent={Zoom}
            title={
              <div className="p-2">
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="foriegnClient"></p> <p>Foreign clients</p>
                  </div>
                  <div>{client?.foreign ? client?.foreign : 0}</div>
                </div>
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="localJobs"></p>
                    <p>Local clients</p>
                  </div>
                  <div>{client?.local ? client?.local : 0}</div>
                </div>
              </div>
            }
          >
            <Card>
              <div className="adminDashboardSummaryContainerMobile">
                <div className="d-flex align-items-center">
                  <div className="adminDashboardClinetIcon">
                    <Icon
                      path={mdiAccountSupervisorOutline}
                      title=""
                      size={1.5}
                      horizontal
                      vertical
                      rotate={180}
                      color="#FFB648"
                    />
                  </div>
                  <Typography className="adminTopentryTextNumber" variant="h4">
                    <b>{totalClients ? totalClients : 0}</b>
                  </Typography>
                </div>
                <section className="m-1 text-align-center">
                  <Typography className="adminTopentryText" variant="subtitle1">
                    <b className="adminDashboardTotalsText">Clients</b>
                  </Typography>
                </section>
              </div>
              <div className="adminDashboardSummaryContainer">
                <div className="adminDashboardClinetIcon mt-2 ">
                  <Icon
                    path={mdiAccountSupervisorOutline}
                    title=""
                    size={1.5}
                    horizontal
                    vertical
                    rotate={180}
                    color="#FFB648"
                  />
                </div>
                <section className="">
                  <Typography className="adminTopentryTextNumber" variant="h4">
                    <b>{totalClients ? totalClients : 0}</b>
                  </Typography>
                  <Typography className="adminTopentryText" variant="subtitle1">
                    <b className="adminDashboardTotalsText"> Clients</b>
                  </Typography>
                </section>
              </div>
            </Card>
          </LightTooltip>
        </div>
        <div className="col-md-3 mb-4">
          <LightTooltip
            TransitionComponent={Zoom}
            title={
              <div className="p-2">
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="foriegnJobs"></p> <p>Foreign Jobs</p>
                  </div>
                  <div>{jobPosted?.foreign ? jobPosted?.foreign : 0}</div>
                </div>
                <div className="adminSummaryTooltip">
                  <div className="d-flex align-items-center">
                    <p className="localJobs"></p>
                    <p>Local Jobs</p>
                  </div>
                  <div>{jobPosted?.local ? jobPosted?.local : 0}</div>
                </div>
              </div>
            }
          >
            <Card>
              <div className="adminDashboardSummaryContainerMobile">
                <div className="d-flex align-items-center">
                  <div className="adminDashboardJobsIcon">
                    <Icon
                      path={mdiFileDocumentMultipleOutline}
                      title=""
                      size={1.5}
                      horizontal
                      vertical
                      rotate={180}
                      color="red"
                    />
                  </div>
                  <Typography className="adminTopentryTextNumber" variant="h4">
                    <b>{totalJobsPosted ? totalJobsPosted : 0}</b>
                  </Typography>
                </div>
                <section className="m-1 text-align-center">
                  <Typography className="adminTopentryText" variant="subtitle1">
                    <b className="adminDashboardTotalsText">Jobs Posted</b>
                  </Typography>
                </section>
              </div>
              <div className="adminDashboardSummaryContainer">
                <div className="adminDashboardJobsIcon mt-2 ">
                  <Icon
                    path={mdiFileDocumentMultipleOutline}
                    title=""
                    size={1.1}
                    horizontal
                    vertical
                    rotate={180}
                    color="red"
                  />
                </div>
                <section className="">
                  <Typography className="adminTopentryTextNumber" variant="h4">
                    <b>{totalJobsPosted ? totalJobsPosted : 0}</b>
                  </Typography>
                  <Typography className="adminTopentryText" variant="subtitle1">
                    <b className="adminDashboardTotalsText">Jobs Posted</b>
                  </Typography>
                </section>
              </div>
            </Card>
          </LightTooltip>
        </div>

        <div className="col-md-3 mb-4">
          <Card>
            <div className="adminDashboardSummaryContainerMobile">
              <div className="d-flex align-items-center">
                <div className="adminDashboardNewRequestsIcon mt-2">
                  <Icon
                    path={mdiAccountGroupOutline}
                    title=""
                    size={1.5}
                    horizontal
                    vertical
                    rotate={180}
                    color="green"
                  />
                </div>
                <Typography className="adminTopentryTextNumber" variant="h4">
                  <b>{newRequests?.new ? newRequests?.new : 0}</b>
                </Typography>
              </div>
              <section className="m-1 text-start">
                <Typography className="adminTopentryText" variant="subtitle1">
                  <p className="adminDashboardTotalsText">New Team Requests</p>
                </Typography>
              </section>
            </div>
            <div className="adminDashboardSummaryContainer">
              <div className="adminDashboardNewRequestsIcon mt-2">
                <Icon
                  path={mdiAccountGroupOutline}
                  title=""
                  size={1.4}
                  horizontal
                  vertical
                  rotate={180}
                  color="green"
                />
              </div>
              <section className="">
                <Typography className="adminTopentryTextNumber" variant="h4">
                  <b>{newRequests?.new ? newRequests?.new : 0}</b>
                </Typography>
                <Typography className="adminTopentryText" variant="subtitle1">
                  <b className="adminDashboardTotalsText">New Team Requests</b>
                </Typography>
              </section>
            </div>
          </Card>
        </div>
      </div>
      <UsersGraph className="mb-4" />
    </div>
  );
}
export default AdminDashboard;
