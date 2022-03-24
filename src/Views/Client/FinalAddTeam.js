import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Avatar,
  TextField,
  Chip,
  Accordion,
  Button,
  AccordionDetails,
  AccordionSummary,
  DialogContent,
  Dialog,
  Snackbar,
} from "@mui/material";
import { Alert } from "@material-ui/lab";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Icon from "@mdi/react";
import {
  mdiMapMarkerOutline,
  mdiDeleteOutline,
  mdiShoppingOutline,
} from "@mdi/js";
import Api from "../../Services/api";
import PlaceOrderDia from "../../Components/Team/PlaceOrderDia";
import { currency } from "../../Services/currency";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "../../Services/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    border: 1,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function FinalAddTeam() {
  const history = useHistory();
  const classes = useStyles();
  const [openPlaceorder, setopenPlaceorder] = useState(false);
  const [userId, setUserId] = useState("");
  const [open1, setOpen1] = useState(false);
  const [openProfilePrompt, setOpenProfilePrompt] = useState(false);

  const [id, setId] = useState(getCurrentUser()?.user?.id);

  const handleClick = () => {
    setOpen1(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const routeToProfile = () => {
    window.location.assign("/profile");
  };

  const openPlaceOrderDia = () => {
    setopenPlaceorder(true);
  };

  const closePlaceOrderDia = () => {
    setopenPlaceorder(false);
  };

  //team data
  const [teamContent, setteamContent] = useState(
    JSON.parse(localStorage.getItem("teamMember")) !== null
      ? JSON.parse(localStorage.getItem("teamMember"))
      : []
  );
  const [addOns, setaddOns] = useState([]);
  const [teamName, setteamName] = useState("");

  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

  const [expanded1, setExpanded1] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded1(isExpanded ? panel : false);
  };

  const [expanded, setExpanded] = useState(false);

  const handleChange1 = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleclick = () => {
    history.push("/profile", { params: `candidatepool` });
    localStorage.setItem("fromCandi", `Candi`);
  };

  const checkProfileCompletion = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        if (response.data.check !== true) {
          setOpenProfilePrompt(true);
        } else {
          openPlaceOrderDia();
        }
      })
      .catch((error) => {});
  };

  const saveToTeamLocalStorage = () => {
    //save whole teamContent
    localStorage.setItem("teamMember", JSON.stringify(teamContent));
  };

  const handleChecked = (currentState, userId) => {
    let toReturn = [];
    teamContent.map((tm) => {
      if (tm.userId === userId) {
        let userName = tm.userName;
        let userPicture = tm.userPicture;
        let location = tm.location;
        let skill = tm.skill;
        let interview = !currentState;
        let addOnIds = tm.addOnIds;
        let teamCont = {
          userId,
          userName,
          userPicture,
          location,
          skill,
          interview,
          addOnIds,
        };
        toReturn.push(teamCont);
      } else {
        toReturn.push(tm);
      }
    });
    setteamContent(toReturn);
  };

  const deleteUserFromTeam = (userId) => {
    let newTeamContent = teamContent.filter(
      (tmCont) => tmCont.userId !== userId
    );
    setteamContent(newTeamContent);
    localStorage.setItem("teamMember", JSON.stringify(newTeamContent));
    window.location.reload();
  };

  const addAddonToUserInTeam = (userId, addonId) => {
    let toReturn = [];
    teamContent.map((tm) => {
      if (tm.userId === userId) {
        let userName = tm.userName;
        let userPicture = tm.userPicture;
        let location = tm.location;
        if (!tm.addOnIds.includes(addonId)) {
          let addons = [...tm.addOnIds, addonId];
          let teamCont = {
            userId,
            userName,
            userPicture,
            location,
            addOnIds: addons,
          };
          toReturn.push(teamCont);
        } else {
          toReturn.push(tm);
        }
      } else {
        toReturn.push(tm);
      }
    });
    setteamContent(toReturn);
  };

  const addOnInUser = (userAccountId, addOnId) => {
    let exists = false;
    const result = teamContent.find(({ userId }) => userId === userAccountId);
    if (result.addOnIds.includes(addOnId)) {
      exists = true;
    }

    return exists;
  };

  const deleteAddonsFromUser = (userId, addonId) => {
    let toReturn = [];
    teamContent.map((tm) => {
      if (tm.userId === userId) {
        let userName = tm.userName;
        let userPicture = tm.userPicture;
        let location = tm.location;
        if (tm.addOnIds.includes(addonId)) {
          let addons = tm.addOnIds.filter((addon) => addon !== addonId);
          let teamCont = {
            userId,
            userName,
            userPicture,
            location,
            addOnIds: addons,
          };
          toReturn.push(teamCont);
        } else {
          toReturn.push(tm);
        }
      } else {
        toReturn.push(tm);
      }
    });

    setteamContent(toReturn);
  };

  const getAddOns = async () => {
    Api()
      .get(`/team/add-ons`)
      .then((response) => {
        setaddOns(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getAddOns();
  }, []);

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-12 pageTitle">
          <h6>
            <b>Team</b>
          </h6>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-10 mb-3">
          <TextField
            id="search"
            label="Create your team name"
            placeholder="Team Name"
            type="text"
            variant="outlined"
            size="small"
            className=""
            fullWidth
            defaultValue={teamName}
            onChange={(e) => setteamName(e.target.value)}
            style={{ background: "white" }}
          />
          <span style={{color:"#2E405B", fontWeight:"bold", paddingLeft:"1rem", marginTop:"5rem"}}>In order to proceed to hire, you need to enter a team name</span>
        </div>
        <div className="col-md-2">
          <Button
            variant="contained"
            className="btn placeOrderBtn"
            onClick={() => {
              // openPlaceOrderDia();
              checkProfileCompletion();
            }}
            disabled={teamName.length <= 0 || teamContent.length <= 0}
          >
            <Icon
              path={mdiShoppingOutline}
              color="white"
              size={1.1}
              horizontal
              vertical
              rotate={180}
              className="p-1"
            />
            Hire Now
          </Button>
        </div>
      </div>

      {teamContent.length <= 0 ? (
        <Card
          className="mt-1"
          style={{
            borderRadius: "3px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            cursor: "pointer",
            padding: "35px",
            height: "390px",
          }}
        >
          <div className="row text-center">
            <div className="col-md-12 mt-4">
              <img
                src="/images/Group 2355.png"
                alt="no new teams"
                width="230"
              />
              <p className="mt-5">
                You currently have no new teams. Add freelancers from <br /> the{" "}
                <b
                  style={{ color: "#0A66C2" }}
                  onClick={() => window.location.assign("/candidate-pool")}
                >
                  candidate pool
                </b>{" "}
                to create a new team.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        teamContent.map((singleContent) => {
          return (
            <div className="row mb-4">
              <div className="col-md-12">
                <Card
                  className="p-4 pb-0"
                  style={{
                    borderRadius: "10px",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div
                      className="d-flex col-md-8 cpImage"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setUserId(
                          localStorage.setItem("userId", singleContent?.userId)
                        );
                        handleclick();
                      }}
                    >
                      <Avatar
                        alt="Candidate Image"
                        src={singleContent?.userPicture}
                        className="cpAvatar mt-0"
                      />
                      <div>
                        <p className="personalInfo">
                          <b>
                            {singleContent?.userName.split(" ")[0] === "null"
                              ? "No name"
                              : singleContent?.userName.split(" ")[0]}
                          </b>
                        </p>
                        <p
                          className="personalInfo"
                          style={{ textTransform: "capitalize" }}
                        >
                          {singleContent?.skill}
                        </p>
                        <div className="d-flex">
                          {singleContent?.city != null ||
                          singleContent?.country != null ? (
                            <p style={{ textTransform: "capitalize" }}>
                              <Icon
                                path={mdiMapMarkerOutline}
                                color="#FFB648"
                                title="Location"
                                size={0.7}
                                horizontal
                                vertical
                                rotate={180}
                                className="mb-1"
                                style={{ marginLeft: "-3px" }}
                              />{" "}
                              {singleContent?.city}
                              {singleContent?.city !== null &&
                              singleContent?.country?.name !== undefined
                                ? `, `
                                : null}
                              {singleContent?.country?.name === undefined
                                ? null
                                : singleContent?.country?.name}
                            </p>
                          ) : (
                            ``
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4" align="right">
                      <Icon
                        path={mdiDeleteOutline}
                        color="red"
                        title="Delete"
                        size={1.2}
                        horizontal
                        vertical
                        rotate={180}
                        className="team-action p-1"
                        onClick={() => {
                          deleteUserFromTeam(singleContent.userId);
                        }}
                      />
                    </div>
                  </div>

                  <Accordion className="outer-accord mt-2">
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      className="dropdown-accordion"
                    ></AccordionSummary>
                    <AccordionDetails className="accord-details">
                      {/* <div className="row">
                          <div className="col-md-12 mb-4">
                            <div className="d-flex p-0">
                              <FormControlLabel
                                control={<Checkbox 
                                  checked={singleContent.interview}
                                  onChange={()=>{
                                    handleChecked(singleContent.interview, singleContent.userId)
                                  }}
                                />}
                                style={{ marginRight: "0" }}
                              />
                              <p className="mt-2 mb-0">
                                <b>Do you want to interview this candidate?</b>
                              </p>
                            </div>
                            <p className="addToTeamhelpText">
                              Please make sure you have provided available interview
                              slots in your profile.
                            </p>
                          </div>
                        </div> */}

                      <div>
                        <div className="col-md-12">
                          <p>
                            <b>Project Tools</b>
                          </p>
                        </div>
                      </div>

                      <div className="mb-5">
                        {addOns &&
                          addOns.map((singleAddOn) => {
                            return (
                              <div>
                                <Accordion
                                  expanded={
                                    expanded1 === JSON.stringify(singleAddOn.id)
                                  }
                                  onChange={handleChange(
                                    JSON.stringify(singleAddOn.id)
                                  )}
                                  className="final-team"
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    className="acccord-summary"
                                  >
                                    <div
                                      class="d-flex justify-content-between"
                                      style={{ marginTop: "-12px" }}
                                    >
                                      <div class="d-flex">
                                        <p
                                          style={{ color: "#555555" }}
                                          className="mt-1 addOnName"
                                        >
                                          {singleAddOn.title}
                                        </p>
                                        <span>
                                          <Chip
                                            className="chip"
                                            label={
                                              currency?.secondary +
                                              singleAddOn.value
                                            }
                                          />
                                        </span>
                                      </div>
                                      <div>
                                        {addOnInUser(
                                          singleContent.userId,
                                          singleAddOn.id
                                        ) ? (
                                          <Button
                                            variant="contained"
                                            className="removeAddOn"
                                            onClick={() => {
                                              deleteAddonsFromUser(
                                                singleContent.userId,
                                                singleAddOn.id
                                              );
                                              saveToTeamLocalStorage();
                                            }}
                                          >
                                            Remove
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="contained"
                                            className="addAddOn"
                                            onClick={() => {
                                              addAddonToUserInTeam(
                                                singleContent.userId,
                                                singleAddOn.id
                                              );
                                              saveToTeamLocalStorage();
                                            }}
                                          >
                                            Add
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <p>{singleAddOn.description}</p>
                                  </AccordionDetails>
                                </Accordion>
                              </div>
                            );
                          })}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              </div>
            </div>
          );
        })
      )}

      <div className="d-flex justify-content-center mb-5 mt-5">
        {teamContent.length <= 0 ? (
          ``
        ) : (
          <Button
            variant="contained hireNowDownBtn"
            className="btn"
            onClick={() => {
              // openPlaceOrderDia();
              checkProfileCompletion();
            }}
            disabled={teamName.length <= 0 || teamContent.length <= 0}
          >
            <Icon
              path={mdiShoppingOutline}
              color="white"
              size={1.1}
              horizontal
              vertical
              rotate={180}
              className="p-1"
            />
            Hire Now
          </Button>
        )}
      </div>

      <div>
        <Dialog
          open={openProfilePrompt}
         // disableBackdropClick
          fullWidth
          maxWidth="sm"
          className="dialogborder"
        >
          <DialogContent className="p-4 pt-5">
            <div className="text-center mb-4">
              <h6>
                <b>Update Your Profile</b>
              </h6>
            </div>
            <div className="d-flex justify-content-center text-center mb-4">
              <p>
                Hello client, welcome to TheFairWork! To place an order you
                will have to provide your name and company details on your
                profile.
              </p>
            </div>
            <div className="d-flex justify-content-center mb-2">
              <Button
                variant="contained"
                className="btn"
                style={{ textTransform: "lowercase" }}
                onClick={() => {
                  routeToProfile();
                }}
              >
                Go to profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={openPlaceorder}
          onClose={closePlaceOrderDia}
          classes={{ paper: classes.paper }}
          fullWidth
          maxWidth="sm"
          hideBackdrop
          className="dialogborder"
        >
          <DialogContent>
            <PlaceOrderDia
              teamName={teamName}
              closePlaceOrderDia={closePlaceOrderDia}
              handleClick={handleClick}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open1}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert>
          Order placed successfully. The admin will contact you soon to further
          process the order.
        </Alert>
      </Snackbar>
    </div>
  );
}

// disabled={teamName.length <= 0 || teamContent.length <= 0 }

export default FinalAddTeam;
