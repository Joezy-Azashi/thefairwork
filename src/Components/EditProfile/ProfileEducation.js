import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Card, CardContent, Button, Dialog } from "@material-ui/core";
import AddEditEducation from "../../Components/Education/AddEditEducation";
import moment from "moment";
import DeleteEducation from "../../Components/Education/DeleteEducation";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";
import Icon from "@mdi/react";
import { mdiSquareEditOutline, mdiDeleteOutline } from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import { getUserEducation } from "../../Services/redux/education/index";
import { eduReducer } from "../../Services/redux/education/education_slice";

function ProfileEducation() {
  const dispatch = useDispatch();
  const education = useSelector(eduReducer);
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [openAddEditEducation, setOpenAddEditEducation] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [educationToPass, setEducationToPass] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [profileId, setProfileId] = useState("");

  // HOOKS TO TOGGLE BETWEEN ADD AND EDIT MODE
  const [editMode, seteditMode] = useState(false);

  const handleOpenAddEditEducation = () => {
    setOpenAddEditEducation(true);
    seteditMode(false);
    setEducationToPass({});
  };

  const handleClose = () => {
    setOpenAddEditEducation(false);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const getEducations = async () => {
    await dispatch(getUserEducation(userAccountId))
      .then((response) => {})
      .catch((error) => {});
  };

  useEffect(() => {
    getEducations();
  }, []);

  return (
    <div>
      <Card className="mb-5 pb-4">
        <CardContent className="p-5 pb-5">
          <div>
            <p className="profile-headings">
              <b>Education</b>
            </p>
          </div>
          <hr className="mobileSpace" />
          {!education.loaded ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : education?.data?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No education has been added yet</p>
            </div>
          ) : (
            education?.data?.map((edu, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-md-10 ">
                      <p className="profile-headings mobileSpace">
                        <b>{edu?.institute_name}</b>
                      </p>
                      <div className="skillSet">
                        <p className="mr-2 mb-2 mobileSpace">
                        {edu?.levelOfEducation} in {edu?.degree_title}
                        </p>
                        {edu?.gradeType === "System" ||
                        edu?.gradeType === "" ? null : (
                          <p className="divider">|</p>
                        )}

                        <p className="mb-2 mobileSpace">
                          <span className="eduPeriod">
                            {edu?.gradeType === "System" ? "" : edu?.gradeType}
                            {edu?.grade || edu?.overall ? " - " : ""}
                          </span>
                          {edu?.grade}
                          {edu?.overall && edu?.grade ? " / " : ""} {edu?.overall}
                        </p>
                      </div>
                      <div>
                        <p className="profileResEdit mobileSpace">
                          <span
                            className="eduPeriod"
                            style={{ display: "none" }}
                          >
                            From:
                          </span>
                          {moment(`${edu?.start_date}`).format("Do MMMM YYYY")}
                        </p>
                        <p className="divider profileResEdit">-</p>
                        <p className="profileResEdit mobileSpace">
                          <span
                            className="eduPeriod"
                            style={{ display: "none" }}
                          >
                            To:
                          </span>
                          {moment(`${edu?.end_date}`).format("Do MMMM YYYY")}
                        </p>
                      </div>
                    </div>
                    <div className="col-12 col-md-2 d-flex editDelete">
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
                            setEducationToPass(edu);
                            setOpenAddEditEducation(true);
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
                            setDeleteId(edu?.id);
                            setUserAccount(edu?.userAccountId);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-2 mobileSpace" />
                </>
              );
            })
          )}

          <div className="row justify-content-center mt-5 mb-3">
            <div className="col-md-12">
              <Button
                style={{ color: "#2E405B" }}
                onClick={handleOpenAddEditEducation}
                startIcon={<AddIcon />}
              >
                Add Education
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
          <DeleteEducation
            deleteId={deleteId}
            closeDeleteDia={closeDeleteDia}
            userAccount={userAccount}
          />
        </Dialog>
        <Dialog
          open={openAddEditEducation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          className="dialogborder"
          maxWidth="sm"
        >
          <AddEditEducation
            editMode={editMode}
            educationToPass={educationToPass}
            profileId={profileId}
            handleClose={handleClose}
          />
        </Dialog>
      </Card>
    </div>
  );
}

export default ProfileEducation;
