import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import {
  Button,
  Card,
  Dialog,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Alert } from "@material-ui/lab";
import { ClipLoader } from "react-spinners";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  mdiMapMarkerOutline,
  mdiCheckboxMarkedCircle,
  mdiMagnify,
} from "@mdi/js";
import Pagination from "@material-ui/lab/Pagination";
import AddOnCom from "./../Components/Team/AddOnCom";
import Api from "../Services/api";
import { getUserType } from "../Services/auth";
import cx from "classnames";
import formatPaymentLevel from "../Services/paymentLevels";
import {formatPaymentValue} from "../Services/paymentLevels";
import ClientBanner from "../Components/ClientBanner";

const useStyles = makeStyles((theme) => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function CandidatePool() {
  const classes = useStyles();
  const history = useHistory();
  const [openAddOn, setopenAddOn] = useState(false);
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [candidates, setcandidates] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [userDetails, setuserDetails] = useState({});
  const [skillCategories, setskillCategories] = useState([]);
  const [subCategories, setsubCategories] = useState([]);
  const [selcategoryId, setselcategoryId] = useState(null);
  const [selskillId, setselskillId] = useState(null);
  const [searchName, setsearchName] = useState("");
  const [paymentLevel, setPaymentLevel] = useState([]);
  const [selpaymentLevel, setSelPaymentLevel] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [pageInfo, setPageInfo] = useState();
  const [userId, setUserId] = useState("");
  const [teamContent, setteamContent] = useState(
    JSON.parse(localStorage.getItem("teamMember")) !== null
      ? JSON.parse(localStorage.getItem("teamMember"))
      : []
  );

  const [search, setSearched] = useState("");

  const URL = window.location.pathname;
  const buttonClass = {
    addTeamBtn: true,
    addToTeamDisabled: getUserType()?.isLimited,
  };

  const handleclick = () => {
    history.push("/profile", { params: `candidatepool` });
    localStorage.setItem("fromCandi", `Candi`);
  };

  let filterData = {
    categoryId: selcategoryId,
    skillId: selskillId,
    name: searchName === "" ? null : searchName,
    paymentLevelId: selpaymentLevel ? selpaymentLevel : null,
  };

  const handleChange = async (e) => {
    setSelPaymentLevel(e.target.value);
    filterData.paymentLevelId = e.target.value;
    await getCandidates();
  };

  const openAddOnDialog = () => {
    setopenAddOn(true);
  };

  const closeAddOneDialog = () => {
    setopenAddOn(false);
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await getCandidates(value);
  };

  const [open1, setOpen1] = useState(false);

  const handleClick1 = () => {
    setOpen1(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const clearFilters = async () => {
    filterData = {
      categoryId: null,
      skillId: null,
      name: null,
      paymentLevelId: null,
    };
    setsearchName("");
    setselcategoryId(null);
    setselskillId(null);
    setskillCategories([]);
    setsubCategories([]);
    setSelPaymentLevel(null);

    getCandidates(1, null, null, null);
    skillsCategories();
  };

  const handleKeyword = async (e) => {
    setsearchName(e.target.value);
    filterData.name = e.target.value;
    await getCandidates();
  };

  const handleCategory = async (e) => {
    setselcategoryId(e.target.value);
    filterData.categoryId = e.target.value;
    setselskillId(null);
    subSkills(e.target.value);

    await getCandidates();
  };

  const handleSubCategories = async (e) => {
    setselskillId(e.target.value);
    filterData.skillId = e.target.value;
    await getCandidates();
  };

  const getCandidates = (pageNumberSelected = 1) => {
    setIsReady(false);
    Api()
      .post(`/users/get-users-by-skill/${pageNumberSelected}`, filterData)
      .then((response) => {
        setIsReady(true);
        setPageInfo(response?.data);
        setcandidates(response?.data?.result?.data);
        setLastPage(response?.data?.result);
        setpageLength(response?.data?.result?.pages);
      })
      .catch((error) => {});
  };

  const skillsCategories = () => {
    Api()
      .get(`/users/categories`)
      .then((response) => {
        setskillCategories(response?.data?.reverse());
      })
      .catch((error) => {});
  };

  const subSkills = (categoryId) => {
    const result = skillCategories.find(({ id }) => id === categoryId);
    setsubCategories(result.Categories);
  };

  const getUserPaymentLevel = async () => {
    Api()
      .post(`admin/all-payment-levels`, {
        s: search,
      })
      .then((response) => {
        setIsReady(true);
        setPaymentLevel(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getCandidates(1, null, null, null);
    skillsCategories();
    getUserPaymentLevel();
  }, []);

  return (
    <div>
     
      {getUserType()?.isLimited && <ClientBanner />}
      <div className="pageTitle mb-4">
        <h6>
          <b>Candidate Pool</b>
        </h6>
      </div>

      <div className="row mt-1">
        <div className="col-md-3" style={{ color: "#707070" }}>
          <div className="d-flex justify-content-between">
            <div>
              <p className="mb-0">
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
                label="Search by keyword"
                type="search"
                variant="outlined"
                size="small"
                fullWidth
                className=" allJobsSearchPlaceholder "
                style={{ backgroundColor: "white" }}
                value={searchName}
                onChange={handleKeyword}
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
          <div className="row">
            <div className="col-md-12 mt-3">
              <TextField
                variant="outlined"
                label="Category"
                size="small"
                select
                fullWidth
                value={selcategoryId}
                className=""
                style={{
                  backgroundColor: "white",
                  textTransform: "capitalize",
                }}
                InputProps={{}}
                onChange={handleCategory}
              >
                {skillCategories.map((cat, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={cat.id}
                      style={{ textTransform: "capitalize" }}
                    >
                      {cat.category}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <div className="col-md-12 mt-3">
              {" "}
              <TextField
                id="status"
                label="Subcategory"
                type="text"
                variant="outlined"
                size="small"
                select
                fullWidth
                className=""
                style={{
                  backgroundColor: "white",
                  textTransform: "capitalize",
                }}
                InputProps={{}}
                onChange={handleSubCategories}
              >
                {selcategoryId === null ? (
                  <i style={{ margin: "0 10px" }}>
                    Select category to see subcategory
                  </i>
                ) : (
                  subCategories.map((skill, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={skill.id}
                        style={{ textTransform: "capitalize" }}
                      >
                        {skill.category}
                      </MenuItem>
                    );
                  })
                )}
              </TextField>
            </div>
            <div className="col-md-12 mt-3 mb-3">
              <TextField
                variant="outlined"
                label="Payment Level"
                size="small"
                select
                fullWidth
                value={selpaymentLevel}
                className=""
                style={{
                  backgroundColor: "white",
                  textTransform: "capitalize",
                }}
                InputProps={{}}
                onChange={handleChange}
              >
                {paymentLevel &&
                  paymentLevel.map((cat, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={cat.id}
                        style={{ textTransform: "capitalize" }}
                      >
                        {/* {cat.name + " " + formatPaymentLevel(`${cat.amount}`)} */}
                        {cat.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </div>
          </div>
        </div>

        <div className="col-md-9 allJobsColumn">
          {!isReady ? (
            <Card
              className=""
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                cursor: "pointer",
                padding: "35px",
              }}
            >
              <div className="d-flex justify-content-center align-item-center ">
                <ClipLoader size={40} color="#1b98e0" loading />
              </div>
            </Card>
          ) : candidates?.length <= 0 ? (
            <Card
              className="mt-1"
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                cursor: "pointer",
                padding: "35px",
              }}
            >
              <div className="row text-center mt-5 mb-5">
                <div className="col-md-12">
                  <img src="/images/Group 2429.png" alt="no job posted" />
                  <p className="mt-5">
                    There are currently no freelancers available.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <div>
                <Card
                  className="mt-1 mb-5"
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                    cursor: "pointer",
                    padding: "35px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#2E405B",
                      paddingBottom: "0",
                      color: "#2E405B",
                    }}
                  >
                    Displaying ({pageInfo?.pageInfo.start} -{" "}
                    {pageInfo?.pageInfo.end}) of {pageInfo?.count} Talent
                  </p>
                  {candidates.map((oneCandidate, index) => {
                    return (
                      <>
                        <div className="row">
                          <div className="col-md-12">
                            <hr className="mt-0" />
                          </div>
                        </div>
                        <div className="row" key={index}>
                          <div
                            className=" d-flex col-md-9 cpImage "
                            onClick={() => {
                              setUserId(
                                localStorage.setItem("userId", oneCandidate?.id)
                              );
                              handleclick();
                            }}
                          >
                            <Avatar
                              alt="Image"
                              className="cpAvatar mt-0 "
                              src={oneCandidate?.UserProfile?.profile_picture}
                            />
                            <div style={{ marginLeft: "8px" }}>
                              <div className="">
                                {getUserType()?.accountTypeId === 1 ? (
                                  <p className="bodyTitles mb-1">
                                    {oneCandidate?.UserProfile?.firstname}
                                  </p>
                                ) : (
                                  <p className="bodyTitles mb-1">
                                    {oneCandidate?.UserProfile?.firstname +
                                      " " +
                                      oneCandidate?.UserProfile?.lastname}
                                  </p>
                                )}
                              </div>
                              <div className="cpool-details">
                                <p
                                  className="mb-1"
                                  style={{
                                    color: "#808080",
                                    fontSize: "14px",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {oneCandidate?.UserProfile?.role}
                                </p>
                                {oneCandidate?.PaymentLevel &&
                                oneCandidate?.UserProfile?.role ? (
                                  <p
                                    className="divider cpool-divider"
                                    style={{
                                      marginRight: "3px",
                                      color: "rgb(128, 128, 128)",
                                    }}
                                  >
                                    |
                                  </p>
                                ) : (
                                  ""
                                )}

                                {oneCandidate?.PaymentLevel ? (
                                  <p
                                    className="mb-1"
                                    style={{ color: "#808080" }}
                                  >
                                    {oneCandidate?.PaymentLevel?.name} (
                                    {formatPaymentValue(
                                      oneCandidate?.paymentValue
                                    )}
                                    )
                                  </p>
                                ) : (
                                  ""
                                )}

                                {oneCandidate?.UserProfile?.CV &&
                                getUserType()?.accountTypeId !== 1 ? (
                                  <p
                                    className="divider cpool-divider"
                                    style={{
                                      marginRight: "3px",
                                      color: "rgb(128, 128, 128)",
                                    }}
                                  >
                                    |
                                  </p>
                                ) : (
                                  ""
                                )}

                                {oneCandidate?.UserProfile?.CV &&
                                getUserType()?.accountTypeId !== 1 ? (
                                  <a
                                    href={oneCandidate?.UserProfile?.CV}
                                    rel="noreferrer"
                                    target="_blank"
                                    className="btn-text"
                                    style={{ textDecoration: "none" }}
                                  >
                                    View CV
                                  </a>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="d-flex mb-2">
                                {oneCandidate?.UserProfile?.city &&
                                oneCandidate?.UserProfile?.Country?.name ? (
                                  <>
                                    <Icon
                                      path={mdiMapMarkerOutline}
                                      size={0.7}
                                      color="#FFB648"
                                      title="Location"
                                      style={{
                                        marginLeft: "-4px",
                                        marginTop: "2px",
                                      }}
                                    />
                                    <p
                                      className="mb-1"
                                      style={{
                                        color: "#808080",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {" "}
                                      {oneCandidate?.UserProfile?.city},{" "}
                                      {oneCandidate?.UserProfile?.Country?.name}{" "}
                                    </p>
                                  </>
                                ) : oneCandidate?.UserProfile?.city ? (
                                  <>
                                    <Icon
                                      path={mdiMapMarkerOutline}
                                      size={0.7}
                                      color="#FFB648"
                                      style={{
                                        marginLeft: "-4px",
                                        marginTop: "5px",
                                      }}
                                    />
                                    <p
                                      className="mb-1"
                                      style={{
                                        color: "#808080",
                                        textTransform: "capitalize",
                                        marginTop: "3px",
                                      }}
                                    >
                                      {" "}
                                      {oneCandidate?.UserProfile?.city}{" "}
                                    </p>
                                  </>
                                ) : oneCandidate?.UserProfile?.Country?.name ? (
                                  <>
                                    <Icon
                                      path={mdiMapMarkerOutline}
                                      size={0.7}
                                      color="#FFB648"
                                      style={{
                                        marginLeft: "-4px",
                                        marginTop: "2px",
                                      }}
                                    />
                                    <p
                                      style={{
                                        color: "#808080",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {" "}
                                      {
                                        oneCandidate?.UserProfile?.Country?.name
                                      }{" "}
                                    </p>
                                  </>
                                ) : (
                                  ``
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-3" align="right">
                            {teamContent.find(
                              ({ userId }) => userId === oneCandidate?.id
                            ) === undefined ? (
                              <>
                                <Button
                                  className={cx(buttonClass)}
                                  disabled={getUserType()?.isLimited}
                                  onClick={() => {
                                    setuserDetails(oneCandidate);
                                    openAddOnDialog();
                                  }}
                                >
                                  Add to team
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  className="addedTeamBtn"
                                  onClick={() => {
                                    setuserDetails(oneCandidate);
                                    openAddOnDialog();
                                  }}
                                >
                                  Added to team
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <p
                          className="job-description summaryLeftSpacing"
                          style={{ color: "#555555" }}
                          onClick={() => {
                            setUserId(
                              localStorage.setItem("userId", oneCandidate?.id)
                            );
                            handleclick();
                          }}
                        >
                          {oneCandidate?.UserProfile?.summary != null || ""
                            ? oneCandidate?.UserProfile?.summary
                            : " Summary not provided"}
                        </p>

                        <div
                          className="col-md-12 summaryLeftSpacing"
                          onClick={() => {
                            setUserId(
                              localStorage.setItem("userId", oneCandidate?.id)
                            );
                            handleclick();
                          }}
                        >
                          {oneCandidate?.UserSkills?.map((skill) => {
                            skill.isCert =
                              skill?.certifySkill || skill?.certifyCategory;
                            return skill;
                          })
                            .sort(function (a, b) {
                              return b.isCert - a.isCert;
                            })
                            .slice(0, 4)
                            .map((skillCategory) => {
                              return (
                                <>
                                  {skillCategory?.certifySkill ||
                                  skillCategory?.certifyCategory ? (
                                    <p className="badge job-badge-skill">
                                      {" "}
                                      <Icon
                                        path={mdiCheckboxMarkedCircle}
                                        size={0.7}
                                        horizontal
                                        vertical
                                        color="#009E20"
                                        rotate={180}
                                        style={{ marginBottom: "1px" }}
                                      />{" "}
                                      {skillCategory?.SubCategory?.category}
                                    </p>
                                  ) : (
                                    <p
                                      className=" badge job-badge"
                                      title={
                                        skillCategory?.SubCategory?.category
                                      }
                                    >
                                      {skillCategory?.SubCategory?.category}
                                    </p>
                                  )}
                                </>
                              );
                            })}
                          {oneCandidate?.GhanaUserSkills?.map((skill) => {
                            skill.isCert =
                              skill?.certifySubIndustry ||
                              skill?.certifyIndustry;
                            return skill;
                          })
                            .sort(function (a, b) {
                              return b.isCert - a.isCert;
                            })
                            .slice(0, 4)
                            .map((otherCategory) => {
                              return (
                                <>
                                  {otherCategory?.certifySubIndustry ||
                                  otherCategory?.certifyIndustry ? (
                                    <p className="badge job-badge-skill">
                                      {" "}
                                      <Icon
                                        path={mdiCheckboxMarkedCircle}
                                        size={0.7}
                                        horizontal
                                        vertical
                                        color="#009E20"
                                        rotate={180}
                                        style={{ marginBottom: "1px" }}
                                      />{" "}
                                      {otherCategory?.IndustryCategory?.name}
                                    </p>
                                  ) : (
                                    <p
                                      className=" badge job-badge"
                                      title={
                                        otherCategory?.IndustryCategory?.name
                                      }
                                    >
                                      {otherCategory?.IndustryCategory?.name}
                                    </p>
                                  )}
                                </>
                              );
                            })}
                        </div>
                      </>
                    );
                  })}
                </Card>
              </div>

              {candidates?.length === undefined || lastPage?.lastPage === 1 ? (
                ``
              ) : (
                <div className="d-flex justify-content-center mt-5 mb-5">
                  <Pagination
                    count={pageLength?.length}
                    variant="outlined"
                    page={pageNumber}
                    onChange={handlePageChange}
                    classes={{ ul: classes.ul }}
                    color="primary"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <Dialog
          open={openAddOn}
          onClose={closeAddOneDialog}
          fullWidth
          maxWidth="sm"
          hideBackdrop
          className="dialogborder"
        >
          <AddOnCom
            userDetails={userDetails}
            openAddOn={openAddOn}
            closeAddOneDialog={closeAddOneDialog}
            handleClick1={handleClick1}
            URL={URL}
          />
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open1}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert>Candidate added to team successfully</Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default CandidatePool;
