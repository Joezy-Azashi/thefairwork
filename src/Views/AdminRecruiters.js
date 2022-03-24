import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  Dialog,
  TableBody,
  DialogContent,
  TableCell,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
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
import { clientAccountType } from "../Services/userTypes";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(0 0 0 / 4%)",
    color: "grey",
    borderBottom: "0px solid rgba(224, 224, 224, 1)",
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

function AdminRecruiters() {
  const classes1 = usePageStyles();
  const classes = useStyles();
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [openReset, setOpenReset] = useState(false);
  const [openDelete, setopenDelete] = useState(false);
  const [userId, setUserId] = useState("");
  const [recruiter, setRecruiter] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [userAccountId, setUserAccountId] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [userAccountType, setuserAccountType] = useState(clientAccountType());
  const [message, setMessage] = useState();

  const closeResetDia = () => {
    setOpenReset(false);
  };

  const closeDeleteDia = () => {
    setopenDelete(false);
  };

  const handleclick = () => {
    history.push("/profile", { params: "client" });
    localStorage.setItem("fromClients", `Clients`);
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await GetRecruiters(value);
  };

  const Deactivate = (event, pageNumberSelected = 1) => {
    const data = {
      accountId: localStorage.getItem("userAccountId"),
    };
    Api()
      .put("/admin/activate", data)
      .then(async (response) => {
        GetRecruiters(pageNumber);
      })
      .catch((error) => {});
  };

  const GetRecruiters = async (pageNumberSelected = 1) => {
    const data = {
      keyword: query,
    };
    Api()
      .post(
        `/admin/get-users/${userAccountType}/?page=${pageNumberSelected}`,
        data
      )
      .then((response) => {
        setIsReady(true);
        setMessage(response?.data.message);
        setRecruiter(response?.data?.result);
        setpageLength(response?.data?.result?.pages);
      })
      .catch((error) => {});
  };

  const viewNewUser = async (id) => {
    Api()
      .post(`admin/update-new-users/${id}`)
      .then((response) => {})
      .catch((error) => {});
  };

  useEffect(() => {
    GetRecruiters();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-md-12 pageTitle mb-4">
          <h6>
            <b> All Recruiters</b>
          </h6>
        </div>
      </div>

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
            style={{ backgroundColor: "white" }}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
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
              GetRecruiters();
            }}
          >
            Search
          </Button>
        </div>
      </div>

      <TableContainer className="parentTable mb-5">
        <Table className="fixedTable">
          <TableHead>
            <TableRow>
              <StyledTableCell className="table-names">NAME</StyledTableCell>
              <StyledTableCell>EMAIL</StyledTableCell>
              <StyledTableCell style={{ paddingLeft: "25px" }}>
                STATUS
              </StyledTableCell>
              <StyledTableCell style={{ paddingLeft: "25px" }}>
                ACTIONS
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {!isReady ? (
            <TableBody>
              <StyledTableRow>
                <StyledTableCell colSpan={4}>
                  <div className="d-flex justify-content-center align-item-center">
                    <ClipLoader size={40} color="#1b98e0" loading />
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          ) : recruiter?.data?.length <= 0 || message === "No users found." ? (
            <TableBody>
              <StyledTableRow>
                <StyledTableCell colSpan={4}>
                  <div className="row text-center mt-5 mb-5">
                    <div className="col-md-12">
                      <img src="/images/Group 2453.png" alt="no job posted" />
                      <p className="mt-5">
                        <p>
                          There are no recruiters on the platform currently.
                        </p>
                      </p>
                    </div>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          ) : (
            recruiter?.data?.map((recruiters) => {
              return (
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell
                      className="tableNameEmail"
                      component="th"
                      scope="row"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {recruiters?.new && (
                        <span className="newNotification">New</span>
                      )}
                      {recruiters?.UserProfile?.firstname === null ||
                      recruiters?.UserProfile?.firstname === "" ||
                      recruiters?.UserProfile?.lastname === null ||
                      recruiters?.UserProfile?.lastname === ""
                        ? "No Name"
                        : recruiters?.UserProfile?.firstname +
                          " " +
                          recruiters?.UserProfile?.lastname}
                    </StyledTableCell>
                    <StyledTableCell>
                      {recruiters?.UserProfile?.email.length > 22
                        ? recruiters?.UserProfile?.email.substring(0, 22) +
                          "..."
                        : recruiters?.UserProfile?.email}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Grid component="label" container alignItems="center">
                        <Grid item>
                          <AntSwitch
                            checked={recruiters?.active}
                            onChange={() => {
                              localStorage.setItem(
                                "userAccountId",
                                recruiters?.id
                              );
                              Deactivate();
                            }}
                            name="checkedA"
                          />
                        </Grid>
                        <Grid item>
                          <span style={{ fontSize: "14px" }}>
                            {recruiters.active ? `Active` : `Inactive`}
                          </span>
                        </Grid>
                      </Grid>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <div className="d-flex justify-content-start">
                        <div>
                          <Button
                            className="action-button"
                            onClick={() => {
                              setUserId(
                                localStorage.setItem("userId", recruiters?.id)
                              );
                              handleclick();
                              viewNewUser(recruiters?.id)
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
                              setUserDetails(recruiters);
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
                              setUserAccountId(recruiters?.id);
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

      <div>
        <Dialog
          open={openReset}
          onClose={closeResetDia}
          classes={{ paper: classes.paper }}
          fullWidth
          maxWidth="xs"
          hideBackdrop
          className="dialogborder"
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
              apiUrl="/user-recruiters"
            />
          </DialogContent>
        </Dialog>
      </div>

      {recruiter?.data?.length === undefined || pageLength?.length === 1 ? (
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
  );
}
export default AdminRecruiters;
