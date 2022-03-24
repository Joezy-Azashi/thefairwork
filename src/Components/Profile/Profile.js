import React, { useState, useEffect } from "react";
import {
  CardContent,
  Card,
  Avatar,
  Button,
  Dialog,
  Snackbar,
  Chip,
} from "@material-ui/core";
import Api from "../../Services/api";
import { loadCSS } from "fg-loadcss";
import { getCurrentUser, getUserType } from "../../Services/auth";
import { recruiterRole, adminRole } from "../../Services/userTypes";
import { ClipLoader } from "react-spinners";
import { mdiCalendarCheck, mdiConsoleNetworkOutline } from "@mdi/js";
import formatPaymentLevel from "../../Services/paymentLevels";
import {formatPaymentValue} from "../../Services/paymentLevels";
import { Alert } from "@material-ui/lab";
import AddOne from "../Team/AddOnCom";
import {
  mdiMapMarkerOutline,
  mdiLinkedin,
  mdiWeb,
  mdiCellphoneBasic,
  mdiGithub,
  mdiTrophyOutline,
  mdiCash,
  mdiCheckboxMarkedCircle,
  mdiEmailOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import ShowMoreText from "react-show-more-text";
import cx from "classnames";

function Profile({ handleDocumentDisplay, viewResume, setViewResume }) {
  const [id, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );

  const candiValue = localStorage.getItem("fromCandi");

  const fromClients = localStorage.getItem("fromClients");

  const [userProfile, setUserProfile] = useState();

  const [isReady, setIsReady] = useState(false);

  const [openAddOn, setopenAddOn] = useState(false);

  const [userDetails, setuserDetails] = useState({});

  const [open1, setOpen1] = useState(false);

  const [teamContent, setteamContent] = useState(
    JSON.parse(localStorage.getItem("teamMember")) !== null
      ? JSON.parse(localStorage.getItem("teamMember"))
      : []
  );

  const viewedUserIn = userProfile?.id;

  const openAddOnDialog = () => {
    setopenAddOn(true);
  };

  const handleClick1 = () => {
    setOpen1(true);
  };

  const closeAddOneDialog = () => {
    setopenAddOn(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfile(response?.data?.user);

        setIsReady(true);
      })
      .catch((error) => {});
  };

  const URL = window.location.pathname;

  const buttonClass = {
    addTeamBtn: true,
    addToTeamDisabled: getUserType()?.isLimited,
  };

  useEffect(() => {
    getProfileData();
  }, []);

  React.useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  return (
    <Card className="mb-4 pb-5 card-padding">
      {!isReady ? (
        <div className="d-flex justify-content-center align-item-center pb-5 mt-5">
          <ClipLoader size={50} color="#1b98e0" loading />
        </div>
      ) : (
        userProfile?.email && (
          <CardContent className="">
            <div className="row ">
              <div className="col-md-8 d-flex cpImage">
                <div>
                  <div>
                    <Avatar
                      alt="Candidate Image"
                      src={userProfile?.UserProfile?.profile_picture}
                      className="cpAvatarProfile mt-0 mr-4"
                    />
                  </div>

                  {getUserType()?.accountTypeId === 3 ||
                  getUserType()?.accountTypeId === 2 ? (
                    <div className="profile-links-web">
                      <div className="profile-links d-flex justify-content-center align-item-center mt-2">
                        {userProfile?.UserProfile?.github && (
                          <div className="">
                            {userProfile?.UserProfile?.github.slice(0, 3) ===
                            "www" ? (
                              <a
                                href={"//" + userProfile?.UserProfile?.github}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiGithub}
                                  size={1.3}
                                  color="#967BB6"
                                />
                              </a>
                            ) : (
                              <a
                                href={userProfile?.UserProfile?.github}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiGithub}
                                  size={1.3}
                                  color="#967BB6"
                                />
                              </a>
                            )}
                          </div>
                        )}

                        {userProfile?.UserProfile?.linkedIn && (
                          <div>
                            {userProfile?.UserProfile?.linkedIn.slice(0, 3) ===
                            "www" ? (
                              <a
                                href={"//" + userProfile?.UserProfile?.linkedIn}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiLinkedin}
                                  size={1.3}
                                  color="#0A66C2"
                                />
                              </a>
                            ) : (
                              <a
                                href={userProfile?.UserProfile?.linkedIn}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiLinkedin}
                                  size={1.3}
                                  color="#0A66C2"
                                />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div>
                  <p className="bodyTitles mb-1">
                    {getUserType().accountTypeId === 2 ||
                    getUserType().accountTypeId === 3 ? (
                      <b style={{ textTransform: "capitalize" }}>
                        {`${userProfile?.UserProfile?.firstname}  ${userProfile?.UserProfile?.lastname}`}
                      </b>
                    ) : (
                      <b style={{ textTransform: "capitalize" }}>
                        {userProfile?.UserProfile?.firstname}
                      </b>
                    )}
                  </p>
                  {userProfile?.UserProfile?.role && (
                    <p style={{ color: "#707070" }}>
                      {userProfile?.UserProfile?.role}
                    </p>
                  )}
                  {/* Mobile view profle links */}
                  {getUserType()?.accountTypeId === 3 ||
                  getUserType()?.accountTypeId === 2 ? (
                    <div className="profile-links-mobile">
                      <div className="profile-links-moble d-flex justify-content-left align-item-center">
                        {userProfile?.UserProfile?.github && (
                          <div>
                            {userProfile?.UserProfile?.github.slice(0, 3) ===
                            "www" ? (
                              <a
                                href={"//" + userProfile?.UserProfile?.github}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiGithub}
                                  size={1.3}
                                  color="#967BB6"
                                />
                              </a>
                            ) : (
                              <a
                                href={userProfile?.UserProfile?.github}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiGithub}
                                  size={1.3}
                                  color="#967BB6"
                                />
                              </a>
                            )}
                          </div>
                        )}

                        {userProfile?.UserProfile?.linkedIn && (
                          <div>
                            {userProfile?.UserProfile?.linkedIn.slice(0, 3) ===
                            "www" ? (
                              <a
                                href={"//" + userProfile?.UserProfile?.linkedIn}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiLinkedin}
                                  size={1.3}
                                  color="#0A66C2"
                                />
                              </a>
                            ) : (
                              <a
                                href={userProfile?.UserProfile?.linkedIn}
                                target="_blank"
                                without
                                rel="noreferrer"
                              >
                                <Icon
                                  path={mdiLinkedin}
                                  size={1.3}
                                  color="#0A66C2"
                                />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {userProfile?.UserProfile?.company !== "" && (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-12">
                          {candiValue === "Candi" ? (
                            ``
                          ) : (
                            <p style={{ color: "#707070" }}>
                              <b>Company Name</b>
                            </p>
                          )}

                          <p style={{ color: "#555555" }}>
                            {userProfile?.UserProfile?.company?.replaceAll(
                              "&amp;",
                              "&"
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {getUserType().accountTypeId === 2 ||
                  candiValue === `Candi` ||
                  getUserType().accountTypeId === 3 ? (
                    <>
                      <div className="col-md-12 summaryWeb">
                        {fromClients === `Clients` ? (
                          ``
                        ) : (
                          <p style={{ color: "#707070", marginBottom: "5px" }}>
                            <b>Summary Pitch</b>
                          </p>
                        )}

                        <ShowMoreText
                          lines={4}
                          more="Read more"
                          less="Read less"
                          expanded={false}
                          width={window.screen.width >= 1920 ? 500 : 380}
                          className="showMore"
                        >
                          <p style={{ color: "#555555" }}>
                            {userProfile?.UserProfile?.summary}
                          </p>
                        </ShowMoreText>
                      </div>
                    </>
                  ) : (
                    ``
                  )}
                </div>
              </div>

              {getUserType().accountTypeId === 2 ||
              getUserType().accountTypeId === 3 ? (
                <>
                  <div className="col-md-1 mt-2 mb-3 summaryMobile">
                    <div className="row">
                      <div className="col-md-12">
                        <p className="bodyTitles">Summary Pitch</p>
                        <ShowMoreText
                          lines={7}
                          more="Read more"
                          less="Read less"
                          expanded={false}
                          width={window.screen.width >= 1920 ? 500 : 380}
                          className="showMore"
                        >
                          <p style={{ color: "#555555", textAlign: "justify" }}>
                            {userProfile?.UserProfile?.summary}
                          </p>
                        </ShowMoreText>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ``
              )}
              <div className="col-md-1 colSpace">
                <hr className="line" />
              </div>
              <div className="col-md-3">
                {userProfile?.UserProfile?.email ? (
                  getUserType().accountTypeId === 2 ||
                  getUserType().accountTypeId === 3 ? (
                    <div className="GCAView">
                      <Icon
                        path={mdiEmailOutline}
                        size={1}
                        color="red"
                        style={{ textAlign: "center" }}
                      />
                      <p
                        style={{
                          marginLeft: "6px",
                          color: "#707070",
                          width: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {userProfile?.email}
                      </p>
                    </div>
                  ) : userProfile?.UserProfile?.email &&
                    viewedUserIn === getCurrentUser()?.user?.id ? (
                    <div className="GCAView">
                      <Icon
                        path={mdiEmailOutline}
                        size={1}
                        color="red"
                        style={{ textAlign: "center" }}
                      />
                      <p
                        style={{
                          marginLeft: "6px",
                          color: "#707070",
                          width: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {userProfile?.email}
                      </p>
                    </div>
                  ) : null
                ) : null}
                {userProfile?.UserProfile?.phone ? (
                  getUserType().accountTypeId === 2 ||
                  getUserType().accountTypeId === 3 ? (
                    <div className="GCAView mt-1">
                      <Icon
                        path={mdiCellphoneBasic}
                        size={1.1}
                        color="#AC5CF2"
                      />
                      <p
                        style={{
                          marginLeft: "6px",
                          color: "#707070",
                          marginTop: "3px",
                        }}
                      >
                        <a
                          href={`tel:${
                            userProfile?.UserProfile?.countryCode +
                            parseInt(userProfile?.UserProfile?.phone)
                          }`}
                          style={{ textDecoration: "none", color: "#707070" }}
                        >
                          {userProfile?.UserProfile?.countryCode +
                            parseInt(userProfile?.UserProfile?.phone)}
                        </a>
                      </p>
                    </div>
                  ) : viewedUserIn === getCurrentUser()?.user?.id &&
                    userProfile?.UserProfile?.phone ? (
                    <div className="GCAView mt-1">
                      <Icon
                        path={mdiCellphoneBasic}
                        size={1.1}
                        color="#AC5CF2"
                      />
                      <p
                        style={{
                          marginLeft: "6px",
                          color: "#707070",
                          marginTop: "3px",
                        }}
                      >
                        <a
                          href={`tel:${
                            userProfile?.UserProfile?.countryCode +
                            parseInt(userProfile?.UserProfile?.phone)
                          }`}
                          style={{ textDecoration: "none", color: "#707070" }}
                        >
                          {userProfile?.UserProfile?.countryCode +
                            parseInt(userProfile?.UserProfile?.phone)}
                        </a>
                      </p>
                    </div>
                  ) : null
                ) : null}

                {userProfile?.UserProfile?.website &&
                getUserType()?.accountTypeId !== 1 ? (
                  <div className="GCAView mt-1">
                    <Icon path={mdiWeb} size={1} color="#55A8FD" />
                    <p
                      style={{
                        marginLeft: "8px",
                        color: "#707070",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      <a
                        href={
                          userProfile?.UserProfile?.website?.includes("http")
                            ? userProfile?.UserProfile?.website
                            : "//" + userProfile?.UserProfile?.website
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: "none",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {userProfile?.UserProfile?.website}{" "}
                      </a>
                    </p>
                  </div>
                ) : viewedUserIn === getCurrentUser()?.user?.id &&
                  userProfile?.UserProfile?.website ? (
                  <div className="d-flex mt-1">
                    <Icon path={mdiWeb} size={1} color="#55A8FD" />
                    <p
                      style={{
                        marginLeft: "8px",
                        color: "#707070",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      <a
                        href={
                          userProfile?.UserProfile?.website?.includes("http")
                            ? userProfile?.UserProfile?.website
                            : "//" + userProfile?.UserProfile?.website
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: "none",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {userProfile?.UserProfile?.website}{" "}
                      </a>
                    </p>
                  </div>
                ) : null}
                {userProfile?.UserProfile?.city &&
                userProfile?.UserProfile?.Country?.name ? (
                  <div className="GCAView mt-1">
                    <Icon path={mdiMapMarkerOutline} size={1} color="#FFB648" />
                    <p
                      style={{
                        marginLeft: "8px",
                        color: "#707070",
                        textTransform: "capitalize",
                      }}
                    >
                      {userProfile?.UserProfile?.city},{" "}
                      {userProfile?.UserProfile?.Country?.name}
                    </p>
                  </div>
                ) : userProfile?.UserProfile?.city ? (
                  <div className="d-flex mt-1">
                    <Icon path={mdiMapMarkerOutline} size={1} color="#FFB648" />
                    <p
                      style={{
                        textTransform: "capitalize",
                        marginLeft: "8px",
                        marginTop: "2px",
                      }}
                    >
                      {userProfile?.UserProfile?.city}
                    </p>
                  </div>
                ) : userProfile?.UserProfile?.Country?.name ? (
                  <div className="GCAView mt-1">
                    <Icon path={mdiMapMarkerOutline} size={1} color="#FFB648" />
                    <p
                      style={{
                        textTransform: "capitalize",
                        marginLeft: "8px",
                        marginTop: "2px",
                      }}
                    >
                      {userProfile?.UserProfile?.Country?.name}
                    </p>
                  </div>
                ) : (
                  ``
                )}
                {userProfile?.UserProfile?.GCA ? (
                  <div className="mt-1 GCAView">
                    <Icon path={mdiTrophyOutline} size={1} color="#009E20" />

                    <p style={{ marginLeft: "8px", color: "#707070" }}>
                      <span
                        style={{ marginBottom: "2px" }}
                        className="GCAMobile"
                      >
                        Coding Assessment (GCA) &nbsp;
                      </span>
                      <Chip
                        icon={
                          <Icon
                            path={mdiCheckboxMarkedCircle}
                            size={0.6}
                            horizontal
                            vertical
                            color="#009E20"
                            rotate={180}
                            type="button"
                          />
                        }
                        style={{
                          background: "#009E2026",
                          color: "#009E20",
                          height: "20px",
                          marginBottom: "3px",
                        }}
                        className="GCAMobile"
                        label={userProfile?.UserProfile?.GCA}
                        variant="outlined"
                      />
                    </p>
                  </div>
                ) : (
                  ``
                )}

                {userProfile?.PaymentLevel ? (
                  <div className="GCAView mt-1">
                    <Icon path={mdiCash} size={1.1} color="#4A56FF" />

                    <p
                      style={{
                        marginLeft: "8px",
                        marginTop: "1px",
                        color: "#707070",
                      }}
                    >
                      {userProfile?.PaymentLevel?.name} (
                      {userProfile?.paymentValue ? formatPaymentValue(userProfile?.paymentValue) : ""})
                    </p>
                  </div>
                ) : (
                  ""
                )}

                {getUserType().accountTypeId === 3 &&
                userProfile?.UserProfile?.availability_link ? (
                  <div className="mt-1">
                    <a
                      style={{ textDecoration: "none" }}
                      href={userProfile?.UserProfile?.availability_link}
                      target="_blank"
                      without
                      rel="noreferrer"
                    >
                      <Button
                        className="p-2"
                        variant="contained"
                        fullWidth
                        style={{ color: "white", background: "#009E20" }}
                        onClick={() => {}}
                      >
                        <Icon
                          path={mdiCalendarCheck}
                          size={1.2}
                          color="#FFFFFF"
                          className="calendly-icon"
                        />
                        Open Calendly
                      </Button>
                    </a>
                  </div>
                ) : null}
                {(getUserType().accountTypeId === 2 ||
                  candiValue === `Candi` ||
                  getUserType().accountTypeId === 3) &&
                getUserType()?.accountTypeId !== 1 ? (
                  <div>
                    {userProfile?.UserProfile?.CV === "" ||
                    userProfile?.UserProfile?.CV === null ? null : (
                      <Button
                        variant="contained"
                        className="addCartBtn mt-2"
                        fullWidth
                        onClick={() => {
                          handleDocumentDisplay(userProfile?.UserProfile?.CV);
                          setViewResume((prev) => !prev);
                        }}
                      >
                        {viewResume ? "Hide Resume" : "View Resume"}
                      </Button>
                    )}
                  </div>
                ) : (
                  ``
                )}
                {candiValue === `Candi` &&
                teamContent.find(({ userId }) => userId === userProfile?.id) ===
                  undefined ? (
                  <div className="mt-2">
                    <Button
                      variant="contained"
                      className="addCartBtn mt-2"
                      fullWidth
                      disabled={getUserType()?.isLimited}
                      onClick={() => {
                        setuserDetails(userProfile);
                        openAddOnDialog();
                      }}
                    >
                      Add to Team
                    </Button>
                  </div>
                ) : (
                  candiValue === `Candi` && (
                    <Button
                      className="addCartBtn2 mt-2"
                      fullWidth
                      onClick={() => {
                        setuserDetails(userProfile);
                        openAddOnDialog();
                      }}
                    >
                      Added to team
                    </Button>
                  )
                )}

                <div></div>
              </div>
            </div>
          </CardContent>
        )
      )}
      <Dialog
        open={openAddOn}
        onClose={closeAddOneDialog}
        fullWidth
        maxWidth="sm"
        hideBackdrop
        className="dialogborder"
      >
        <AddOne
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
    </Card>
  );
}

export default Profile;
