import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Chip,
  Checkbox,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getCurrentUser } from "../../Services/auth";
import { Alert } from "@material-ui/lab";
import {currency} from "../../Services/currency"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function PlaceOrderDia({
  openAddOn,
  teamName,
  closePlaceOrderDia,
  handleClick,
}) {

  const [teamContent, setteamContent] = useState(
    JSON.parse(localStorage.getItem("teamMember")) !== null
      ? JSON.parse(localStorage.getItem("teamMember"))
      : []
  );
  const [addonsUsersHere, setaddonsUsersHere] = useState(
    JSON.parse(localStorage.getItem("addonsUsersHere")) !== null
      ? JSON.parse(localStorage.getItem("addonsUsersHere"))
      : []
  );
  const [addOns, setaddOns] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [noData, setNodata] = useState();
  const [instantHire, setInstantHire] = useState(false)

  const [expanded1, setExpanded1] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded1(isExpanded ? panel : false);
  };

  const handleInstantHire = (e) =>{
     setInstantHire(e.target.checked)
     saveToTeamLocalStorage()
  }

  const [open1, setOpen1] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const saveToTeamLocalStorage = () => {
    //save whole teamContent
    localStorage.setItem("teamMember", JSON.stringify(teamContent));
  };

  const addAddOnToWholeTeam = (addonId) => {
    let toReturn = [];

    teamContent.map((tm) => { //return here
      let userName = tm.userName;
      let userPicture = tm.userPicture;
      let location = tm.location;
      let skill = tm.skill;
      let interview = tm.interview;
      if (!tm.addOnIds.includes(addonId)) {
        let addons = [...tm.addOnIds, addonId];
        let teamCont = {
          userId: tm.userId,
          userName,
          userPicture,
          location,
          skill,
          interview,
          addOnIds: addons,
        };
        toReturn.push(teamCont);
        storeAddedAddonsHere(tm.userId, addonId);
        storeAdddonsHereLocalStorage();
      } else {
        toReturn.push(tm);
      }
    });

    setteamContent(toReturn);
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

  const storeAddedAddonsHere = (userId, addonId) => {
    let recordExists = false;

    addonsUsersHere.map((adUs) => {
      if (adUs.userId === userId && adUs.addonId === addonId) {
        recordExists = true;
      }
    });

    if (!recordExists)
      setaddonsUsersHere((prevArray) => {
        return [...prevArray, { userId, addonId }];
      });
  };

  const storeAdddonsHereLocalStorage = () => {
    localStorage.setItem("addonsUsersHere", JSON.stringify(addonsUsersHere));
  };

  const deleteJustAddedAddonsFromUser = (addonIdArg) => {
    const result = addonsUsersHere.filter(
      ({ addonId }) => addonId === addonIdArg
    );
    result.map((addonUserObject) => {            //return
      deleteAddonsFromUser(addonUserObject.userId, addonIdArg);
      const finalAddonsHere = addonsUsersHere.filter(
        ({ addonId }) => addonId !== addonIdArg
      );
      setaddonsUsersHere(finalAddonsHere);
    });
  };

  const getAddOns = async () => {
    Api()
      .get(`/team/add-ons`)
      .then((response) => {
        setIsReady(true)
        setaddOns(response?.data?.result);
      })
      .catch((error) => {});
  };

  const placeOrder = () => {
    const data = {
      teamName,
      teamOwnerId: getCurrentUser()?.user?.id,
      content: teamContent,
      instantHire,
    };
    Api()
      .post(`/team/place-order`, data)
      .then((response) => {
        closePlaceOrderDia();
        handleClick();
        setTimeout(() => {
          window.location.assign("/team-orders");
        }, 3000);
      })
      .catch((error) => {});
      localStorage.clear('teamMember')
      localStorage.clear('addonsUsersHere')
  };

  useEffect(() => {
    getAddOns();
  }, []);

  return (
    <div>
      <div className="row text-center mt-4">
        <div className="col-md-12">
          <h6>
          <b >
            Would you like to add project tools for the whole team?
          </b>
          </h6>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-12">
          <p style={{ color: "#55555586", fontSize: "13px" }}>
            The project tools selected will be made available to all team members and
            not just individual.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 ">
          <p style={{ color: "#555555", padding: "0 20px" }}>
            Choose your project tools
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
                  expanded={expanded1 === JSON.stringify(singleAddOn.id)  }
                  onChange={handleChange(JSON.stringify(singleAddOn.id))}
                   style={{ borderRadius: "8px" }}>
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
                              label={ currency?.secondary +  singleAddOn.value}
                            />
                          </span>
                        </div>
                        <div>
                          {addonsUsersHere.find(
                            ({ addonId }) => addonId === singleAddOn.id
                          ) === undefined ? (
                            <Button
                              variant="contained"
                              className="addAddOn"
                              onClick={() => {
                                addAddOnToWholeTeam(singleAddOn.id);
                                saveToTeamLocalStorage();
                              }}
                            >
                              Add
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              className="removeAddOn"
                              onClick={() => {
                                deleteJustAddedAddonsFromUser(singleAddOn.id);
                                saveToTeamLocalStorage();
                              }}
                            >
                              Remove
                            </Button>
                          )}
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
        {/* instant hire here */}
        <div className="col-md-12 mb-3">
        <Checkbox
              type="checkbox"
              id="instantHire"
              size="small"
              onChange={handleInstantHire}
              name="type"
              className="instantHirecheckbox filtercheckbox"
              style={{ paddingLeft: "0", backgroundColor: "#FFFFFF" }}
        />
        <span  style={{  fontSize: "13px" }}>
             Please check this box, if you want to hire them instantly.
            <a href={window.location}> See how instant hiring works</a>
        </span>
        </div>
        </div>
      )
}
      <div className="text-center mt-4 mb-5">
        <Button
          variant="contained"
          className="btn"
          onClick={() => {
            placeOrder();
          }}
        >
          Hire Now
        </Button>
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
        <Alert>Order has been placed successfully</Alert>
      </Snackbar>
    </div>
  );
}

export default PlaceOrderDia;
