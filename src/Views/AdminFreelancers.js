import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Snackbar } from "@material-ui/core";
import {
  Table,
  Dialog,
  TableBody,
  DialogContent,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  InputAdornment,
} from "@mui/material";
import { Switch } from "@material-ui/core";
import Icon from "@mdi/react";
import {
  mdiSquareEditOutline,
  mdiLockOutline,
  mdiDeleteOutline,
  mdiMagnify,
} from "@mdi/js";
import ResetPass from "../Components/Auth/ResetPass";
import { useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import DeleteUser from "../Components/Admin/DeleteUser";
import Api from "../Services/api";
import Pagination from "@material-ui/lab/Pagination";
import { freelancerAccountType } from "../Services/userTypes";
import SelectAvailability from "../Components/SelectAvailability";
import { Alert } from "@material-ui/lab";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(0 0 0 / 4%)",
    color: "grey",
    borderBottom: "0px solid rgba(224, 224, 224, 1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "white",
      margin: 100,
      borderBottom: "5px solid rgba(224, 224, 224, 1)",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {},
});

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 40,
    height: 20,
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 9,
    paddingBottom: 1,
    margin: "0 5px 0 0",
    display: "flex",
  },
  switchBase: {
    padding: 1,
    color: "white",
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#2E405B",
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
    marginTop: 3,
    marginLeft: 11,
  },
  track: {
    borderRadius: 50 / 2,
    opacity: 1,
    backgroundColor: "#BCBCCB",
  },
  checked: {},
}))(Switch);

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function AdminFreelancers() {
  const classes1 = usePageStyles();
  const classes = useStyles();
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [openReset, setOpenReset] = useState(false);
  const [openDelete, setopenDelete] = useState(false);
  const [userId, setUserId] = useState("");
  const [freelancer, setFreelancer] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [userAccountId, setUserAccountId] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [message, setMessage] = useState();
  const [userAccountType, setuserAccountType] = useState(
    freelancerAccountType()
  );

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const shoeSnack = () => {
    setOpen(true);
  };

  const closeAlert = () => {
    setTimeout(() => {
      setAlert({
        open: false,
        message: "",
        severity: "",
      });
    }, 4000);
  };

  const closeResetDia = () => {
    setOpenReset(false);
  };

  const closeDeleteDia = () => {
    setopenDelete(false);
  };

  const handleclick = () => {
    history.push("/profile");
    localStorage.setItem("fromClients", ``);
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await GetFreelancers(value);
  };

  const Deactivate = (pageNumberSelected = 1) => {
    const data = {
      accountId: localStorage.getItem("userAccountId"),
    };
    Api()
      .put("/admin/activate", data)
      .then(async (response) => {
        GetFreelancers(pageNumber);
      })
      .catch((error) => {});
  };

  const viewNewUser = async (id) => {
    Api()
      .post(`admin/update-new-users/${id}`)
      .then((response) => {})
      .catch((error) => {});
  };

  const GetFreelancers = async (pageNumberSelected = 1) => {
    const data = {
      keyword: query,
    };
    Api()
      .post(
        `/admin/get-users/${userAccountType}/?page=${pageNumberSelected}`,
        data
      )
      .then((response) => {
        setMessage(response?.data.message);
        setIsReady(true);
        setFreelancer(response?.data?.result.data);
        setpageLength(response?.data?.result?.pages);
      })
      .catch((error) => {});
  };

  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, message: "" });
    setOpen(false);
  };

  const handleChangeAvailability = async (data, userId) => {
    try {
      await Api()
        .put(`/admin/update-availability/${userId}`, {
          availability: data,
        })
        .then((response) => {
          shoeSnack();
          if (response.status === 200) {
            setAlert({
              open: true,
              message: `${data}`,
              severity: "success",
            });
            closeAlert();
          } else {
            shoeSnack();
            if (response.status === 400) {
              setAlert({
                open: true,
                message: `${data}-${response.data.message}`,
                severity: "error",
              });
              closeAlert();
            }
          }
        });

      const old = [...freelancer];
      const updated = old.map((d) => {
        return d.id === userId ? { ...d, availability: data } : d;
      });
      setFreelancer([...updated]);
      return;
    } catch (e) {
      return;
    }
  };
  useEffect(() => {
    GetFreelancers();
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <div className="row">
        <div className="col-md-12 pageTitle mb-4">
          <h6>
            <b> All Freelancers</b>
          </h6>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClosed}
      >
        <Alert severity={`${alert.severity}`}>
          {alert.message === "hired" || alert.message === "not available"
            ? "Freelancer is not available for hire"
            : "Freelancer is available for hire"}
        </Alert>
      </Snackbar>

      <div className="row">
        <div className="col-md-4 mb-4">
          <TextField
            id="search"
            label="Search by keyword"
            type="search"
            variant="outlined"
            size="small"
            value={query}
            fullWidth
            className=" allJobsSearchPlaceholder"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
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
        <div className="col-md-2 mb-4">
          <Button
            variant="contained"
            className="searchOrderBtn w-100"
            onClick={() => {
              GetFreelancers();
            }}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <TableContainer className="parentTable">
            <Table className="fixedTable">
              <TableHead>
                <TableRow>
                  <StyledTableCell>NAME</StyledTableCell>
                  <StyledTableCell>EMAIL</StyledTableCell>
                  <StyledTableCell style={{ paddingLeft: "25px" }}>
                    STATUS
                  </StyledTableCell>
                  <StyledTableCell style={{ paddingLeft: "25px" }}>
                    AVAILABILITY
                  </StyledTableCell>
                  <StyledTableCell style={{ paddingLeft: "25px" }}>
                    ACTIONS
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              {!isReady ? (
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell colSpan={5}>
                      <div className="d-flex justify-content-center align-item-center">
                        <ClipLoader size={40} color="#1b98e0" loading />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              ) : freelancer?.data?.length <= 0 ||
                message === "No users found." ? (
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell colSpan={5}>
                      <div className="row text-center mt-5 mb-5">
                        <div className="col-md-12">
                          <img
                            src="/images/Group 2453.png"
                            alt="no job posted"
                          />
                          <p className="mt-5">
                            <p>
                              There are no freelancers on the platform
                              currently.
                            </p>
                          </p>
                        </div>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              ) : (
                freelancer?.map((freelancers, index) => {
                  return (
                    <TableBody key={index}>
                      <StyledTableRow>
                        <StyledTableCell
                          className="tableNameEmail"
                          component="th"
                          scope="row"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {freelancers?.new && (
                            <span className="newNotification">New</span>
                          )}

                          {freelancers?.UserProfile?.firstname === null ||
                          freelancers?.UserProfile?.firstname === "" ||
                          freelancers?.UserProfile?.lastname === null ||
                          freelancers?.UserProfile?.lastname === ""
                            ? "No Name"
                            : freelancers?.UserProfile?.firstname +
                              " " +
                              freelancers?.UserProfile?.lastname}
                        </StyledTableCell>
                        <StyledTableCell>
                          {freelancers?.UserProfile?.email?.length > 22
                            ? freelancers?.UserProfile?.email.substring(0, 22) +
                              "..."
                            : freelancers?.UserProfile?.email}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Grid container alignItems="center">
                            <Grid>
                              <AntSwitch
                                checked={freelancers?.active}
                                onChange={() => {
                                  localStorage.setItem(
                                    "userAccountId",
                                    freelancers?.id
                                  );
                                  Deactivate(pageNumber);
                                }}
                                name="checkedA"
                              />
                            </Grid>
                            <Grid item>
                              <span style={{ fontSize: "14px" }}>
                                {freelancers.active ? `Active` : `Inactive`}
                              </span>
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell>
                          <SelectAvailability
                            freelancer={freelancers}
                            handleAvailabilty={handleChangeAvailability}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <div className="d-flex justify-content-start">
                            <div>
                              <Button
                                className="action-button"
                                onClick={() => {
                                  setUserId(
                                    localStorage.setItem(
                                      "userId",
                                      freelancers?.id
                                    )
                                  );
                                  handleclick();
                                  viewNewUser(freelancers?.id);
                                }}
                              >
                                <Icon
                                  path={mdiSquareEditOutline}
                                  title="Edit"
                                  size={1.1}
                                  horizontal
                                  vertical
                                  color="grey"
                                  rotate={180}
                                  type="button"
                                  className="freelance-action p-1"
                                />
                              </Button>
                            </div>
                            <div>
                              <Button
                                className="action-button"
                                onClick={() => {
                                  setOpenReset(true);
                                  setUserDetails(freelancers);
                                }}
                              >
                                <Icon
                                  path={mdiLockOutline}
                                  title="Reset password"
                                  size={1.1}
                                  horizontal
                                  vertical
                                  color="grey"
                                  rotate={180}
                                  type="button"
                                  className="freelance-action p-1"
                                />
                              </Button>
                            </div>
                            <div>
                              <Button
                                className="action-button"
                                onClick={() => {
                                  setopenDelete(true);
                                  setUserAccountId(freelancers?.id);
                                }}
                              >
                                <Icon
                                  path={mdiDeleteOutline}
                                  title="Delete"
                                  size={1.1}
                                  horizontal
                                  color="grey"
                                  vertical
                                  rotate={180}
                                  type="button"
                                  className=" freelance-action p-1"
                                />
                              </Button>
                            </div>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  );
                })
              )}
            </Table>
          </TableContainer>
        </div>

        <div>
          <Dialog
            open={openReset}
            onClose={closeResetDia}
            className="dialogborder"
            fullWidth
            maxWidth="xs"
            hideBackdrop
          >
            <DialogContent>
              <ResetPass
                userDetails={userDetails}
                closeResetDia={closeResetDia}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <Dialog
            open={openDelete}
            onClose={closeDeleteDia}
            classes={{ paper: classes.paper }}
            fullWidth
            maxWidth="xs"
            hideBackdrop
            className="dialogborder"
          >
            <DialogContent>
              <DeleteUser
                closeDeleteDia={closeDeleteDia}
                userAccountId={userAccountId}
                apiUrl="/user-freelancers"
              />
            </DialogContent>
          </Dialog>
        </div>

        {freelancer?.length === undefined || pageLength?.length === 1 ? (
          ``
        ) : (
          <div className="d-flex justify-content-center mt-5 mb-5">
            <Pagination
              count={pageLength?.length}
              variant="outlined"
              page={pageNumber}
              onChange={handlePageChange}
              classes={{ ul: classes1.ul }}
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminFreelancers;
