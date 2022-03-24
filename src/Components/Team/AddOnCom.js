import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@mdi/react";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";
import {
  Button,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { api } from "../../public/config";
import { currency } from "../../Services/currency";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function AddOne({ userDetails, closeAddOneDialog, handleClick1, URL }) {
  const [showCancelIcon, setShowCancelIcon] = useState(true);
  const [noData, setNodata] = useState();
  const [isReady, setIsReady] = useState(false);
  const [interviewChecked, setInterviewChecked] = useState(false);

  const [teamInfo, setteamInfo] = useState({});
  const [teamContent, setteamContent] = useState(
    JSON.parse(localStorage.getItem("teamMember")) !== null
      ? JSON.parse(localStorage.getItem("teamMember"))
      : []
  );
  const [modifyTeam, setmodifyTeam] = useState(false);
  const [selectedUserId, setselectedUserId] = useState(null);
  const [addOns, setaddOns] = useState([]);
  const [instantHire, setInstantHire] = useState(false);

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [expanded1, setExpanded1] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded1(isExpanded ? panel : false);
  };

  const handleInstantHire = (e) => {
    setInstantHire(e.target.checked); //instanthire
  };

  const handleChecked = (e) => {
    setInterviewChecked(!interviewChecked);
    let toReturn = [];
    teamContent.map((tm) => {
      if (tm.userId === userDetails.id) {
        let userName = tm.userName;
        let userPicture = tm.userPicture;
        let location = tm.location;
        let skill = tm.skill;
        let interview = !interviewChecked;
        let addOnIds = tm.addOnIds;
        let teamCont = {
          userId: userDetails.id,
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
    setmodifyTeam(false);
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

  const saveToTeamLocalStorage = () => {
    //save whole teamContent
    localStorage.setItem("teamMember", JSON.stringify(teamContent));
    setTimeout(() => {
      window.location.assign(URL);
    }, 2000);
    closeAddOneDialog();
    handleClick1();
  };

  const addUserToTeam = (
    userId,
    userName,
    userPicture,
    city,
    country,
    skill
  ) => {
    let teamMemberExists = false;
    if (teamContent?.length < 1) {
      setteamInfo({ name: "Temp" });
    }

    teamContent?.map((tm) => {
      if (tm?.userId === userId) {
        teamMemberExists = true;
      }
    });

    if (!teamMemberExists)
      setteamContent((prevArray) => {
        return [
          ...prevArray,
          {
            userId,
            userName,
            userPicture,
            city,
            country,
            skill,
            interview: interviewChecked,
            addOnIds: [],
          },
        ];
      });
  };

  const addAddonToUserInTeam = (userId, addonId) => {
    let toReturn = [];
    teamContent.map((tm) => {
      if (tm.userId === userId) {
        let userName = tm.userName;
        let userPicture = tm.userPicture;
        let city = tm.city;
        let country = tm.country;
        let skill = tm.skill;
        let interview = tm.interview;
        if (!tm.addOnIds.includes(addonId)) {
          let addons = [...tm.addOnIds, addonId];
          let teamCont = {
            userId,
            userName,
            userPicture,
            city,
            country,
            skill,
            interview,
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
    setmodifyTeam(false);
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
        let skill = tm.skill;
        let interview = tm.interview;
        if (tm.addOnIds.includes(addonId)) {
          let addons = tm.addOnIds.filter((addon) => addon !== addonId);
          let teamCont = {
            userId,
            userName,
            userPicture,
            location,
            skill,
            interview,
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
        setIsReady(true);
        setNodata(response?.data?.message);
        setaddOns(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    // fetchDataFromLocalStorage()
    setTimeout(
      addUserToTeam(
        userDetails && userDetails?.id,
        userDetails?.UserProfile?.firstname +
          " " +
          userDetails?.UserProfile?.lastname,
        userDetails?.UserProfile?.profile_picture,
        userDetails?.UserProfile?.city,
        userDetails?.UserProfile?.Country,
        // userDetails?.UserProfile?.phone
        userDetails?.UserSkills[0]?.MainCategory?.category
      ),
      1000
    );
    getAddOns();
  }, []);

  return (
    <DialogContent className="p-4">
      <div className="row text-center mt-4 mb-2">
        <div className="col-md-12">
          <h6>
            <b> Add Project Tools</b>
          </h6>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-md-12 mb-4">
          <div className="d-flex p-0">
            <FormControlLabel
              control={
              <Checkbox
              checked={teamContent.find(({ userId }) => userId === userDetails.id)?.interview}
                  onChange={handleChecked}
                 />}
              style={{ marginRight: "0" }}
            />
            <p className="mt-2 mb-0">
              <b>Do you want to interview this candidate?</b>
            </p>
          </div>
          <p className="addToTeamhelpText">
            Please make sure you have provided available interview slots in your
            profile.
          </p>
        </div>
      </div> */}
      <div className="row">
        <div className="col-md-12 mb-2">
          <p style={{ color: "#55555586", fontSize: "13px" }}>
            Do you require any additional resources for your team? Choose your project tools
          </p>
        </div>
      </div>

      {!isReady ? (
        <div className="d-flex justify-content-center align-item-center">
          <ClipLoader size={40} color="#1b98e0" loading />
        </div>
      ) : noData === "No " ? (
        <div className="row text-center mt-5">
          <div className="col-md-12">No Candidate found</div>
        </div>
      ) : (
        <div className="row">
          {addOns?.map((singleAddOn) => {
            return (
              <div className="col-md-12 mb-3">
                <form>
                  <Accordion
                    expanded={expanded1 === JSON.stringify(singleAddOn.id)}
                    onChange={handleChange(JSON.stringify(singleAddOn.id))}
                    className="accordionRadius"
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      className="acccord-summary"
                    >
                      <div
                        class="d-flex justify-content-between"
                        style={{ marginTop: "-12px" }}
                      >
                        <div className="d-flex">
                          <p
                            className="mt-1 addOnName"
                            title={singleAddOn.title}
                          >
                            <b>{singleAddOn.title}</b>
                          </p>
                          <span>
                            <Chip
                              className="chip"
                              label={currency.secondary + singleAddOn.value}
                            />
                          </span>
                        </div>
                        <div>
                          <div>
                            {addOnInUser(userDetails.id, singleAddOn.id) ? (
                              <Button
                                className="removeAddOn"
                                variant="contained"
                                onClick={() => {
                                  deleteAddonsFromUser(
                                    userDetails.id,
                                    singleAddOn.id
                                  );
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
                                    userDetails.id,
                                    singleAddOn.id
                                  );
                                }}
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>{singleAddOn.description}</p>
                    </AccordionDetails>
                  </Accordion>
                </form>
              </div>
            );
          })}
        </div>
      )}
      <div className="text-center mt-4 mb-2">
        <Button
          variant="contained"
          className="btn"
          onClick={() => {
            saveToTeamLocalStorage();
          }}
        >
          Add to team
        </Button>
      </div>
    </DialogContent>
  );
}

export default AddOne;
