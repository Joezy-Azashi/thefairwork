import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
  Card,
  Avatar,
  Chip,
  Accordion,
  Button,
  AccordionDetails,
  AccordionSummary,
  Snackbar,
  DialogActions,
  Typography,
  DialogContent,
  Dialog,
  IconButton,
} from "@material-ui/core";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Icon from "@mdi/react";
import {
  mdiDeleteOutline,
  mdiMapMarkerOutline,
  mdiAlertCircleOutline,
  mdiCloseCircleOutline,
  mdiCheckCircleOutline,
  mdiClockFast,
  mdiPackageVariantClosed,
} from "@mdi/js";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import { deepEqual } from "../../Services/utils";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { currency } from "../../Services/currency";
import { recruiterRole } from "../../Services/userTypes";
import CloseIcon from "@material-ui/icons/Close";

function OneOrder() {
  const [singleOrder, setsingleOrder] = useState(
    JSON.parse(localStorage.getItem("singleOrder")) !== null
      ? JSON.parse(localStorage.getItem("singleOrder"))
      : []
  );

  const [accountType, setaccountType] = useState(recruiterRole());

  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);

  const [singleOrderImmutable, setsingleOrderImmutable] = useState(
    JSON.parse(localStorage.getItem("singleOrder")) !== null
      ? JSON.parse(localStorage.getItem("singleOrder"))
      : []
  );

  const [addOns, setaddOns] = useState([]);
  const [statusData, setStatusData] = useState(
    JSON.parse(localStorage.getItem("singleOrder")) !== null
      ? JSON.parse(localStorage.getItem("singleOrder"))
      : []
  );

  const [closeDia, setcloseDia] = useState(statusData?.status);

  const [saveBtnDisabled, setsaveBtnDisabled] = useState(
    JSON.parse(localStorage.getItem("saveBtnDisabled")) !== null
      ? JSON.parse(localStorage.getItem("saveBtnDisabled"))
      : true
  );
  const [selectedIndex, setSelectedIndex] = useState(
    statusData?.status === "in-process"
      ? 1
      : statusData?.status === "completed"
      ? 2
      : statusData?.status === "canceled"
      ? 3
      : 0
  );
  const [status, setstatus] = useState(statusData?.status);
  const [options, setOptions] = useState([
    "New Teams",
    "In-process",
    "Completed",
    "Canceled",
  ]);
  const teamName = statusData?.teamName;

  const [statusImmutable, setstatusImmutable] = useState(statusData?.status);
  const [open1, setOpen1] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const handleClose1 = () => {
    setcloseDia("new");
  };

  const handleClosebtn = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const history = useHistory();

  const handleCreatePayment = () => {
    const orderId = singleOrder.id;

    history.push({
      pathname: "/create-payment",
      params: { keyword: "new-order", orderId },
    });
  };

  const saveOrder = async () => {
    const data = {
      status: status,
      teamName: singleOrder.teamName,
      teamOwnerId: singleOrder.teamOwnerId,
      content: singleOrder.content,
      instantHire: singleOrder.instantHire,
      hasInvoice: singleOrder.hasInvoice,
    };

    Api()
      .put(`/team/update-order/${singleOrder.id}`, data)
      .then((response) => {
        window.location.assign("/team-orders");
      })
      .catch((error) => {
        setOpen1(true);
      });
  };

  const deleteUserFromTeam = (userId) => {
    let oldata = singleOrder;
    let newTeamContent = singleOrder.content.filter(
      (tmCont) => tmCont.userId !== userId
    );

    oldata.content = newTeamContent;
    setsingleOrder(oldata);
    localStorage.setItem("singleOrder", JSON.stringify(oldata));
    setsaveBtnDisabled(deepEqual(singleOrder, singleOrderImmutable));
    localStorage.setItem(
      "saveBtnDisabled",
      deepEqual(singleOrder, singleOrderImmutable)
    );
    window.location.reload();
  };

  const saveToTeamLocalStorage = () => {
    //save whole teamContent
    localStorage.setItem("singleOrder", JSON.stringify(singleOrder));
  };

  const deleteAddonsFromUser = (userId, addonId) => {
    let toReturn = [];
    let olddata = singleOrder;
    singleOrder.content.map((tm) => {
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
    olddata.content = toReturn;
    setsingleOrder(olddata);
    setsaveBtnDisabled(deepEqual(singleOrder, singleOrderImmutable));
  };

  const getAddOns = async () => {
    Api()
      .get(`/team/add-ons`)
      .then((response) => {
        setaddOns(response?.data?.result);
      })
      .catch((error) => {});
  };

  const addOnInUser = (userAccountId, addOnId) => {
    let exists = false;
    const result = singleOrder.content.find(
      ({ userId }) => userId === userAccountId
    );
    if (result.addOnIds.includes(addOnId)) {
      exists = true;
    }

    return exists;
  };

  useEffect(() => {
    getAddOns();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);

    if (index === 0) {
      setstatus("new");
    } else if (index === 1) {
      setstatus("in-process");
    } else if (index === 2) {
      setstatus("completed");
    } else {
      setstatus("canceled");
    }

    if (statusImmutable !== index) {
      setsaveBtnDisabled(false);
    } else {
      setsaveBtnDisabled(true);
    }

    setOpen(false);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-8 pageTitle">
              <h6 className="card-title">
                <b>{teamName?.replaceAll("&amp;", "&")}</b>
              </h6>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-8 pageTitle">
              <h6 className="card-title">
                <b>Order Status:</b>
              </h6>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12 pageTitle d-flex justify-content-between mb-0">
              {accountType ? (
                <div className="col-md-8 pageTitle">
                  <Button
                    variant="outlined"
                    style={{
                      borderColor:
                        status === "new"
                          ? "#2E405B"
                          : status === "in-process"
                          ? "#FFB648"
                          : status === "completed"
                          ? "#009E20"
                          : "#F70000",
                      color:
                        status === "new"
                          ? "#2E405B"
                          : status === "in-process"
                          ? "#FFB648"
                          : status === "completed"
                          ? "#009E20"
                          : "#F70000",
                    }}
                    // onClick={() => {
                    //   saveOrder();
                    // }}
                  >
                    <Icon
                      path={
                        status === "new"
                          ? mdiPackageVariantClosed
                          : status === "in-process"
                          ? mdiClockFast
                          : status === "completed"
                          ? mdiCheckCircleOutline
                          : mdiCloseCircleOutline
                      }
                      size={1}
                      color={
                        status === "new"
                          ? "#2E405B"
                          : status === "in-process"
                          ? "#FFB648"
                          : status === "completed"
                          ? "#009E20"
                          : "#F70000"
                      }
                    />{" "}
                    {status === "new" ? (
                      <span> &nbsp; New Order</span>
                    ) : status === "in-process" ? (
                      <span> &nbsp; In-Process</span>
                    ) : status === "completed" ? (
                      <span> &nbsp; Completed</span>
                    ) : (
                      <span> &nbsp; Cancelled</span>
                    )}
                  </Button>
                </div>
              ) : (
                ``
              )}

              {
                !accountType ? (
                  <>
                  <ButtonGroup
                variant=""
                ref={anchorRef}
                aria-label="button"
                style={{ backgroundColor: "#E9E9EE" }}
              >
                <Button
                  style={{
                    color: "#2E405B",
                    borderRight: "0.5px solid rgb(255, 255, 255, .2)",
                    width: "120px",
                  }}
                >
                  {options[selectedIndex]}
                </Button>
                <Button
                  size="small"
                  aria-controls={open ? "split-button-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="menu"
                  onClick={handleToggle}
                  style={{ color: "#2E405B", width: "15px" }}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>

              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: "1" }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClosebtn}>
                        <MenuList id="split-button-menu">
                          {options.map((option, index) => (
                            <MenuItem
                              key={option}
                              selected={index === selectedIndex}
                              onClick={(event) =>
                                handleMenuItemClick(event, index)
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
                  </>
                ) : (
                  ``
                )
              }
              

              {accountType ? (
                ``
              ) : (
                <Button
                  variant="contained"
                  className="btn"
                  disabled={singleOrder?.hasInvoice}
                  onClick={() => {
                    handleCreatePayment();
                  }}
                >
                  Create Payment
                </Button>
              )}
            </div>
          </div>

          {singleOrder?.content?.map((orderDetails, index) => {
            return (
              <div className="row mt-5 mb-5">
                <div className="col-md-12">
                  <Card
                    key={index}
                    className="mt-1"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                      cursor: "pointer",
                      padding: "35px",
                      paddingBottom: "0",
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <div className="d-flex col-md-8 cpImage">
                        <Avatar
                          alt="Candidate Image"
                          src={orderDetails?.userPicture}
                          className="cpAvatar mt-0"
                        />
                        <div>
                          <p className="bodyTitles mb-1 mt-1">
                            {orderDetails?.userName}
                          </p>

                          <p
                            className="personalInfo"
                            style={{
                              textTransform: "capitalize",
                              color: "#808080",
                            }}
                          >
                            {orderDetails?.skill}
                          </p>

                          {orderDetails?.location === null ||
                          orderDetails?.location === "" ? null : (
                            <div className="d-flex">
                              <Icon
                                path={mdiMapMarkerOutline}
                                color="#FFB648"
                                title="Location"
                                size={0.7}
                                horizontal
                                vertical
                                rotate={180}
                                className=""
                                style={{ marginLeft: "-3px", marginTop: "1px" }}
                              />
                              <p style={{ textTransform: "capitalize" }}>
                                {orderDetails?.location}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4" align="right">
                        {(status !== "new") & accountType ? (
                          ``
                        ) : (
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
                              deleteUserFromTeam(orderDetails?.userId);
                            }}
                          />
                        )}
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
                                control={
                                  <Checkbox className="filtercheckbox" checked={orderDetails?.interview} />
                                }
                                style={{ marginRight: "0" }}
                              />
                              <p className="mt-2 mb-0">
                                <b>Do you want to interview this candidate?</b>
                              </p>
                            </div>
                            <p className="addToTeamhelpText">
                              Please make sure you have provided available
                              interview slots in your profile.
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
                          {addOns.map((addons, index) => {
                            return addOnInUser(
                              orderDetails.userId,
                              addons.id
                            ) ? (
                              <Accordion className="final-team" key={index}>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1bh-content"
                                  id="panel1bh-header"
                                  className="acccord-summary"
                                >
                                  <div
                                    className="d-flex justify-content-between"
                                    style={{ marginTop: "-12px" }}
                                  >
                                    <div className="d-flex">
                                      <p
                                        style={{ color: "#555555" }}
                                        className="mt-1 addOnName"
                                      >
                                        {addons?.title}
                                      </p>
                                      <span>
                                        <Chip
                                          className="chip"
                                          label={
                                            currency?.secondary + addons?.value
                                          }
                                        />
                                      </span>
                                    </div>
                                    <div>
                                      {status !== "new" && accountType ? (
                                        ``
                                      ) : (
                                        <Button
                                          variant="contained"
                                          className="removeAddOn"
                                          onClick={() => {
                                            deleteAddonsFromUser(
                                              orderDetails.userId,
                                              addons.id
                                            );
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
                                  <p>{addons?.description}</p>
                                </AccordionDetails>
                              </Accordion>
                            ) : (
                              ""
                            );
                          })}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {singleOrder?.content?.length <= 0 ? (
        ``
      ) : (
        <div className="d-flex justify-content-center mb-5">
          <div style={{ display: "inline-block", marginLeft: "3vw" }}>
            <Button
              variant="contained"
              className="btn"
              disabled={saveBtnDisabled}
              onClick={() => {
                saveOrder();
              }}
            >
              Save order
            </Button>
          </div>
        </div>
      )}

      <div>
        <Dialog
          className="dialogborder"
          onClose={handleClose1}
          aria-labelledby="customized-dialog-title"
          open={closeDia !== "new" && accountType }
        >
          <div align="right">
            <IconButton onClick={handleClose1}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="text-center">
            <Icon
              path={mdiAlertCircleOutline}
              color="red"
              size={1.5}
              horizontal
              vertical
              rotate={180}
            />
          </div>
          <DialogContent className="p-4">
            <Typography
              style={{ color: "#222121", textAlign: "center" }}
              className="mb-3"
            >
              Sorry, you are not allowed to make any changes to this order. If
              you want to make any changes, please reach out to our support
              team.
            </Typography>
          </DialogContent>
          <DialogActions></DialogActions>
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
        <Alert severity="error">There was an error in saving the order.</Alert>
      </Snackbar>
    </div>
  );
}

export default OneOrder;
