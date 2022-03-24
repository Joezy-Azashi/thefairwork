import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Dialog } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddSkillTag from "../../Components/SkillTag/AddSkillTag";
import Api from "../../Services/api";
import { getCurrentUser } from "../../Services/auth";
import { ClipLoader } from "react-spinners";
import Icon from "@mdi/react";
import { mdiSquareEditOutline, mdiDeleteOutline } from "@mdi/js";

export default function SkillTag() {
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [openAddSkillTags, setOpenAddSkillTags] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [skillTagsData, setSkillTagsData] = useState();
  const [skillTagToPass, setSkillTagToPass] = useState({});
  const [profileId, setProfileId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // HOOKS TO TOGGLE BETWEEN ADD AND EDIT MODE
  const [editMode, seteditMode] = useState(false);
  const handleOpenAddSkills = () => {
    setOpenAddSkillTags(true);
    seteditMode(false);
    setSkillTagToPass({});
  };

  const handleClose = () => {
    setOpenAddSkillTags(false);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const getUserSkills = async () => {
    Api()
      .get(`/users/get-tag/${userAccountId}`)
      .then((response) => {
        setIsReady(true);
        setSkillTagsData(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getUserSkills();
  }, []);

  return (
    <div>
      <Card className="mb-5">
        <CardContent className="p-5 pb-5">
          <div>
            <p className="profile-headings">
              <b>Skill Tags</b>
            </p>
          </div>
          <hr />
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : skillTagsData?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No skills has been added yet</p>
            </div>
          ) : (
            skillTagsData?.map((skills, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-md-6 d-flex justify-content-end">
                      <div>
                        <Icon
                          path={mdiSquareEditOutline}
                          title="Edit"
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                          type="button"
                          onClick={() => {
                            seteditMode(true);
                            skillTagToPass(skills);
                            setOpenAddSkillTags(true);
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
                          color="red"
                          rotate={180}
                          type="button"
                          onClick={() => {
                            openDeleteDia();
                            setDeleteId(skills?.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              );
            })
          )}

          <div className="row justify-content-center text-center mt-5 mb-5">
            <div className="col-md-12">
              <Button
                className="btn-text"
                onClick={handleOpenAddSkills}
                startIcon={<AddIcon />}
              >
                Add Skills
              </Button>
            </div>
          </div>
        </CardContent>
        <Dialog
          open={openAddSkillTags}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
          className="dialogborder"
        >
          <AddSkillTag skillTagToPass={skillTagToPass} profileId={profileId} />
        </Dialog>
      </Card>
    </div>
  );
}
