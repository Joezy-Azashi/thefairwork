import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Card, CardContent, Button, Dialog } from "@material-ui/core";
import AddEditExperience from "../../Components/Experience/AddEditExperience";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";
import DeleteExperience from "../../Components/Experience/DeleteExperience";
import Icon from "@mdi/react";
import { mdiSquareEditOutline, mdiDeleteOutline } from "@mdi/js";
import ReactHtmlParser from "react-html-parser";
import { useDispatch, useSelector } from "react-redux";
import { expReducer } from "../../Services/redux/experience/experience_slice";
import { getUserExperience } from "../../Services/redux/experience/index";

function ProfileExperience() {
  const dispatch = useDispatch();
  const experiences = useSelector(expReducer);
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [openAddEditExperience, setOpenAddEditExperience] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [experienceToPass, setExperienceToPass] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [userAccount, setUserAccount] = useState("");

  // HOOKS TO TOGGLE BETWEEN ADD AND EDIT MODE
  const [editMode, seteditMode] = useState(false);

  const handleOpenAddEditEducation = () => {
    setOpenAddEditExperience(true);
    seteditMode(false);
    setExperienceToPass({});
  };

  const handleClose = () => {
    setOpenAddEditExperience(false);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  //function to get user experience information
  const getExperience = async () => {
    await dispatch(getUserExperience(userAccountId))
      .then((response) => {
        setIsReady(true);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getExperience();
  }, []);

  return (
    <div>
      <Card className="mb-5 pb-4">
        <CardContent className="p-5 pb-5">
          <div>
            <p className="profile-headings">
              <b>Experience</b>
            </p>
          </div>
          <hr />
          {!experiences?.loaded ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : experiences?.data?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No experience has been added yet</p>
            </div>
          ) : (
            experiences?.data?.map((exp, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-md-10">
                      <div className="skillSet">
                        <p className="profile-headings mobileSpace">
                          <span
                            className="eduPeriod"
                            style={{ display: "none" }}
                          >
                            Position:{" "}
                          </span>{" "}
                          <b>{exp?.position}</b>
                        </p>
                        <p className="exdivider">-</p>
                        <p className="profile-headings mobileSpace">
                          <span
                            className="eduPeriod"
                            style={{ display: "none" }}
                          >
                            Company:{" "}
                          </span>
                          <b>{ReactHtmlParser(exp?.company)}</b>
                        </p>
                      </div>
                      <div className="expTitle">
                        {exp?.city && exp?.Country?.name ? (
                          <p className="mr-2 mobileSpace">
                            {exp?.city}, {exp?.Country?.name}
                          </p>
                        ) : exp?.city ? (
                          <p className="mr-2 mobileSpace">{exp?.city}</p>
                        ) : exp?.Country?.name ? (
                          <p className="mr-2 mobileSpace">
                            {exp?.Country?.name}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <p className="profileResEdit mobileSpace">
                        <span className="eduPeriod" style={{ display: "none" }}>
                          From:{" "}
                        </span>
                        {moment(`${exp?.from}`).format("Do MMMM YYYY")}
                      </p>
                      <p className="divider profileResEdit">-</p>
                      <p className="profileResEdit">
                        <span className="eduPeriod" style={{ display: "none" }}>
                          To:{" "}
                        </span>
                        {moment(`${exp?.to}`).format("Do MMMM YYYY") === "Invalid date" ? "Present" : moment(`${exp?.to}`).format("Do MMMM YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">{ReactHtmlParser(exp?.responsibilities)}</div>
                  </div>
                  <div className="col-12 col-md-12 d-flex editDelete">
                    <div>
                      <Icon
                        path={mdiSquareEditOutline}
                        title="Edit"
                        color="#2E405B"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        type="button"
                        onClick={() => {
                          seteditMode(true);
                          setExperienceToPass(exp);
                          setOpenAddEditExperience(true);
                        }}
                      />
                    </div>
                    <div>
                      <Icon
                        path={mdiDeleteOutline}
                        title="Delete"
                        size={1}
                        horizontal
                        vertical
                        color="#F70000"
                        rotate={180}
                        type="button"
                        onClick={() => {
                          openDeleteDia();
                          setDeleteId(exp?.id);
                          setUserAccount(exp?.userAccountId);
                        }}
                      />
                    </div>
                  </div>
                  <hr className="mt-1" />
                </>
              );
            })
          )}

          <div className="row justify-content-center mt-5 mb-3">
            <div className="col-md-12">
              <Button
                style={{ color: "#2E405B" }}
                className="btn-text"
                onClick={handleOpenAddEditEducation}
                startIcon={<AddIcon />}
              >
                Add Experience
              </Button>
            </div>
          </div>
        </CardContent>
        <Dialog
          open={openDeleteDialog}
          onClose={closeDeleteDia}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <DeleteExperience
            deleteId={deleteId}
            closeDeleteDia={closeDeleteDia}
            userAccount={userAccount}
          />
        </Dialog>
        <Dialog
          open={openAddEditExperience}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="sm"
          className="dialogborder"
          disableEnforceFocus
        >
          <AddEditExperience
            editMode={editMode}
            experienceToPass={experienceToPass}
            profileId={profileId}
            handleClose={handleClose}
          />
        </Dialog>
      </Card>
    </div>
  );
}

export default ProfileExperience;
