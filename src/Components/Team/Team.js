import React, { useState, useEffect } from "react";
import {
  DialogContent,
  TextField,
  Button,
  Snackbar,
  Collapse,
} from "@material-ui/core";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { getCurrentUser } from "../../Services/auth";

function Team() {
  const [teamInfo, setteamInfo] = useState({});
  const [teamContent, setteamContent] = useState([]);
  const [modifyTeam, setmodifyTeam] = useState(false);
  const [selectedUserId, setselectedUserId] = useState(null);

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeAlert = () => {
    setTimeout(() => {
      setAlert({
        open: false,
        message: "",
        severity: "",
      });
    }, 4000);
  };

  // candidate pool mock db
  let teamRepo = [
    { id: "1", name: "John" },
    { id: "3", name: "Ben" },
    { id: "5", name: "Jack" },
    { id: "8", name: "Chris" },
    { id: "12", name: "Rum" },
    { id: "2", name: "Hollow" },
  ];

  // addon pool mock db
  let addOnRepo = [
    { id: "17", name: "Jira" },
    { id: "3", name: "Clockify" },
    { id: "5", name: "Laptop" },
    { id: "6", name: "AWS" },
    { id: "12", name: "Sendgrid" },
  ];

  const addUserToTeam = (userId) => {
    let teamMemberExists = false;
    if (teamContent.length < 1) {
      setteamInfo({ name: "Temp" });
    }

    teamContent.map((tm) => {
      if (tm.userId === userId) {
        teamMemberExists = true;
      }
    });

    if (!teamMemberExists)
      setteamContent((prevArray) => {
        return [...prevArray, { userId, addonId: [] }];
      });
  };

  const deleteUserFromTeam = (userId) => {
    let newTeamContent = teamContent.filter(
      (tmCont) => tmCont.userId !== userId
    );
    setteamContent(newTeamContent);
  };

  const addAddonToUserInTeam = (userId, addonId) => {
    let toReturn = [];
    teamContent.map((tm) => {
      if (tm.userId === userId) {
        if (!tm.addonId.includes(addonId)) {
          let addons = [...tm.addonId, addonId];
          let teamCont = { userId, addonId: addons };
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

  const addAddOnToWholeTeam = (addonId) => {
    let toReturn = [];

    teamContent.map((tm) => {
      if (!tm.addonId.includes(addonId)) {
        let addons = [...tm.addonId, addonId];
        let teamCont = { userId: tm.userId, addonId: addons };
        toReturn.push(teamCont);
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
        if (tm.addonId.includes(addonId)) {
          let addons = tm.addonId.filter((addon) => addon !== addonId);
          let teamCont = { userId, addonId: addons };
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

  return (
    <div className="card-padding" style={{ marginTop: "80px" }}>
      <div class="row">
        <div class="col-md-4">
          <h3>CAndidate Pool</h3>
          <ul>
            {teamRepo.map((member) => {
              return (
                <li>
                  {member.id}........{member.name}
                  <button
                    onClick={() => {
                      addUserToTeam(member.id);
                    }}
                    class="btn btn-primary"
                  >
                    Add to team
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div class="col-md-4">
          <h5>Team Info</h5>
          <h3>{teamInfo.name}</h3>
          <ul>
            {teamContent.map((content) => {
              return (
                <li style={{ padding: "5px" }}>
                  <p> User: {content.userId}</p>
                  {content.addonId.map((addon) => {
                    return (
                      <p>
                        {addon}{" "}
                        <button
                          onClick={() => {
                            deleteAddonsFromUser(content.userId, addon);
                          }}
                          class="btn btn-primary"
                        >
                          --
                        </button>
                      </p>
                    );
                  })}
                  <button
                    onClick={() => {
                      setselectedUserId(content.userId);
                      setmodifyTeam(true);
                    }}
                    class="btn btn-primary"
                  >
                    Add Add on / Modify
                  </button>
                  <button
                    onClick={() => {
                      deleteUserFromTeam(content.userId);
                    }}
                    class="btn btn-primary"
                  >
                    --user
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {!modifyTeam ? null : (
          <div class="col-md-4">
            <h3>Project Tools</h3>
            <ul>
              {addOnRepo.map((repo) => {
                return (
                  <li>
                    {repo.id}........{repo.name}
                    <button
                      onClick={() => {
                        addAddonToUserInTeam(selectedUserId, repo.id);
                      }}
                      class="btn btn-primary"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => {
                        addAddOnToWholeTeam(repo.id);
                      }}
                      class="btn btn-primary"
                    >
                      Add To Whole Team
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}{" "}
      </div>
    </div>
  );
}

export default Team;
