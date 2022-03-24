import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Dialog, Chip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddSkillTag from "../../Components/SkillTag/AddSkillTag";
import Api from "../../Services/api";
import { getCurrentUser } from "../../Services/auth";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@mdi/react";
import { mdiCloseCircleOutline } from "@mdi/js";

import { getTag } from "../../Services/redux/skillTag/index";
import { skilltagereducer } from "../../Services/redux/skillTag/skill_tag_slice";

export default function ProfileSkillTag() {
  const dispatch = useDispatch();
  const skillTags = useSelector(skilltagereducer);

  const [openAddEditSkills, setOpenAddEditSkills] = useState(false);
  const [skillTagData, setSkillTagData] = useState();
  const [skillToPass, setSkillToPass] = useState({});
  const [profileId, setProfileId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const userId = getCurrentUser()?.user?.id;

  // HOOKS TO TOGGLE BETWEEN ADD AND EDIT MODE
  const [editMode, seteditMode] = useState(false);
  const handleOpenAddSkillTag = () => {
    setOpenAddEditSkills(true);
    seteditMode(false);
    setSkillToPass({});
  };

  const handleClose = () => {
    setOpenAddEditSkills(false);
  };

  const getUserTags = async () => {
    await dispatch(getTag(userId))
      .then((response) => {
        setSkillTagData(response.payload.data);
        setIsReady(true);
      })
      .catch((error) => {});
  };

  const DeleteSkillTag = async () => {
    Api()
      .delete(`/users/delete-tag/${deleteId}`)
      .then((response) => {
        window.location.assign("/edit-profile");
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
      });
  };

  useEffect(() => {
    getUserTags();
  }, []);

  return (
    <div>
      <Card className="mb-5 pb-4">
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
          ) : skillTagData?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No skill tag has been added yet</p>
            </div>
          ) : (
            <div className="d-flex skill-tag-container">
              {skillTagData?.map((skillTag, index) => {
                return (
                  <div className="d-flex flex-row">
                    <div
                      key={index}
                      className="job-badge-skill-tag d-flex align-item-center text-center"
                    >
                      <div> #{skillTag.name}</div>
                      <div>
                        <Icon
                          className="skill-tag"
                          path={mdiCloseCircleOutline}
                          title="Delete"
                          size={0.6}
                          horizontal
                          vertical
                          color="#2E405B"
                          rotate={180}
                          type="button"
                          onClick={() => {
                            setDeleteId(skillTag?.id);
                            DeleteSkillTag();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="row justify-content-center mt-5 mb-3">
            <hr />
            <div className="col-md-12">
              <Button
                className="btn-text"
                onClick={handleOpenAddSkillTag}
                startIcon={<AddIcon />}
                style={{ whiteSpace: "nowrap", flexWrap: "nowrap" }}
              >
                Add skill tag
              </Button>
            </div>
          </div>
        </CardContent>

        <Dialog
          open={openAddEditSkills}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="sm"
          className="dialogborder"
        >
          <AddSkillTag
            editMode={editMode}
            skillToPass={skillToPass}
            profileId={profileId}
            handleClose={handleClose}
          />
        </Dialog>
      </Card>
    </div>
  );
}
