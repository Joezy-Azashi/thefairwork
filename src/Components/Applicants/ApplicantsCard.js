import { Avatar, Dialog, Slide, Snackbar, Button } from "@material-ui/core";
import Icon from "@mdi/react";
import { mdiMapMarkerOutline } from "@mdi/js";
import { useState } from "react";
import React from "react";
import { useHistory } from "react-router";
import { mdiCheckboxMarkedCircle } from "@mdi/js";
import AddOnCom from "../../Components/Team/AddOnCom";
import { Alert } from "@material-ui/lab";
import cx from "classnames";
import { getUserType } from "../../Services/auth";
import formatPaymentLevel from "../../Services/paymentLevels";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
const buttonClass = {
  addTeamBtn: true,
  addToTeamDisabled: getUserType()?.isLimited,
};

const ApplicantsCard = ({ applicant, userAccount }) => {
  const history = useHistory();
  const [openCandidateDetails, setOpenCandidateDetails] = useState(false);
  const [userDetails, setuserDetails] = useState({});
  const [openAddOn, setopenAddOn] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [teamContent, setteamContent] = useState(
    JSON.parse(localStorage.getItem("teamMember")) !== null
      ? JSON.parse(localStorage.getItem("teamMember"))
      : []
  );
  const URL = window.location.pathname;

  const handleCloseCandidateDetails = () => {
    setOpenCandidateDetails(false);
  };

  const openAddOnDialog = () => {
    setopenAddOn(true);
  };

  const closeAddOneDialog = () => {
    setopenAddOn(false);
  };

  const handleClick1 = () => {
    setOpen1(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  // const [applicants, setApplicants] = useState([applicant]);
  const applicants = [applicant];

  const handleClick = () => {
    history.push("/applicantdetails", { params: applicant });
    localStorage.setItem("fromCandi", `Candi`);
  };

  return (
    <>
      {applicants &&
        applicants.map((appl) => (
          <>
            <div className="row" key={appl?.UserAccount?.id}>
              <div className=" d-flex col-md-9 cpImage " onClick={handleClick}>
                <Avatar
                  alt="Applicant"
                  className="cpAvatar mt-0 "
                  src={appl?.UserAccount?.UserProfile?.profile_picture}
                />
                <div style={{ marginLeft: "8px" }}>
                  <div className="" onClick={handleClick}>
                    {getUserType()?.accountTypeId !== 1 &&
                    getUserType()?.accountTypeId !== 4 ? (
                      <p className="bodyTitles mb-1">
                        {appl?.UserAccount?.UserProfile?.firstname +
                          " " +
                          appl?.UserAccount?.UserProfile?.lastname}
                      </p>
                    ) : (
                      <p className="bodyTitles mb-1">
                        {appl?.UserAccount?.UserProfile?.firstname}
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
                      {appl?.UserAccount?.UserProfile?.role?.length > 25
                        ? appl?.UserAccount?.UserProfile?.role.substring(
                            0,
                            25
                          ) + "..."
                        : appl?.UserAccount?.UserProfile?.role}
                    </p>

                    {appl?.UserAccount?.PaymentLevel &&
                    appl?.UserAccount?.UserProfile?.role ? (
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

                    {appl?.UserAccount?.PaymentLevel ? (
                      <p className="mb-1" style={{ color: "#808080" }}>
                        {appl?.UserAccount?.PaymentLevel?.name} (
                        {formatPaymentLevel(
                          appl?.UserAccount?.PaymentLevel?.amount
                        )}
                        )
                      </p>
                    ) : (
                      ""
                    )}

                    {appl?.UserAccount?.UserProfile.CV ? (
                      getUserType()?.accountTypeId !== 1 &&
                      getUserType()?.accountTypeId !== 4 ? (
                        <p
                          className="divider cpool-divider"
                          style={{
                            marginRight: "3px",
                            color: "rgb(128, 128, 128)",
                          }}
                        >
                          |
                        </p>
                      ) : null
                    ) : (
                      ""
                    )}
                    {appl?.UserAccount?.UserProfile.CV ? (
                      getUserType()?.accountTypeId !== 1 &&
                      getUserType()?.accountTypeId !== 4 ? (
                        <a
                          href={appl?.UserAccount?.UserProfile.CV}
                          rel="noreferrer"
                          target="_blank"
                          className="btn-text"
                          style={{ textDecoration: "none" }}
                        >
                          View CV
                        </a>
                      ) : null
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="d-flex mb-2">
                    {appl.UserAccount?.UserProfile?.city &&
                    appl.UserAccount?.UserProfile?.Country?.name ? (
                      <>
                        <Icon
                          path={mdiMapMarkerOutline}
                          size={0.7}
                          color="#FFB648"
                          style={{ marginLeft: "-4px", marginTop: "2px" }}
                        />
                        <p
                          className="mb-1"
                          style={{
                            color: "#808080",
                            textTransform: "capitalize",
                          }}
                        >
                          {" "}
                          {appl.UserAccount?.UserProfile?.city},{" "}
                          {appl.UserAccount?.UserProfile?.Country?.name}{" "}
                        </p>
                      </>
                    ) : appl.UserAccount?.UserProfile?.city ? (
                      <>
                        <Icon
                          path={mdiMapMarkerOutline}
                          size={0.7}
                          color="#FFB648"
                          style={{ marginLeft: "-4px", marginTop: "2px" }}
                        />
                        <p
                          className="mb-1"
                          style={{
                            color: "#808080",
                            textTransform: "capitalize",
                          }}
                        >
                          {" "}
                          {appl.UserAccount?.UserProfile?.city}{" "}
                        </p>
                      </>
                    ) : appl.UserAccount?.UserProfile?.Country?.name ? (
                      <>
                        <Icon
                          path={mdiMapMarkerOutline}
                          size={0.7}
                          color="#FFB648"
                          style={{ marginLeft: "-4px", marginTop: "2px" }}
                        />
                        <p
                          style={{
                            color: "#808080",
                            textTransform: "capitalize",
                          }}
                        >
                          {" "}
                          {appl.UserAccount?.UserProfile?.Country?.name}{" "}
                        </p>
                      </>
                    ) : (
                      ``
                    )}
                  </div>
                </div>
              </div>

              {userAccount === 1 ? (
                <div className="col-md-3" align="right">
                  {teamContent.find(
                    ({ userId }) => userId === appl?.UserAccount?.id
                  ) === undefined ? (
                    <>
                      <Button
                        className={cx(buttonClass)}
                        disabled={getUserType().isLimited}
                        onClick={() => {
                          setuserDetails(appl?.UserAccount);
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
                          setuserDetails(appl?.UserAccount);
                          openAddOnDialog();
                        }}
                      >
                        Added to team
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                ``
              )}
            </div>

            <div className="row mt-2">
              <div
                className="col-md-12 summaryLeftSpacingApplicants"
                style={{
                  marginTop:
                    appl.UserAccount?.UserProfile?.Country?.name == null ||
                    ("" && appl.UserAccount?.UserProfile?.city == null) ||
                    ""
                      ? "0px"
                      : "-18px",
                }}
              >
                <p
                  className="job-description  justify-content "
                  style={{ color: "#555555" }}
                  onClick={handleClick}
                >
                  {appl.UserAccount.UserProfile?.summary != null || ""
                    ? appl.UserAccount.UserProfile?.summary
                    : " Summary not provided"}
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 summaryLeftSpacingApplicants">
                {appl?.UserAccount?.UserSkills.map((skill) => {
                  skill.isCert = skill?.certifySkill || skill?.certifyCategory;
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
                            title={skillCategory?.SubCategory?.category}
                          >
                            {skillCategory?.SubCategory?.category}
                          </p>
                        )}
                      </>
                    );
                  })}

                {appl?.UserAccount?.GhanaUserSkills.map((skill) => {
                  skill.isCert =
                    skill?.certifySubIndustry || skill?.certifyIndustry;
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
                            title={otherCategory?.IndustryCategory?.name}
                          >
                            {otherCategory?.IndustryCategory?.name}
                          </p>
                        )}
                      </>
                    );
                  })}
              </div>
            </div>
          </>
        ))}

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
    </>
  );
};

export default ApplicantsCard;
