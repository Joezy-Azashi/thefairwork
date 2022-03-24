import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  Snackbar
} from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import Api from "../../Services/api";
import IconButton from "@material-ui/core/IconButton";
import { getCurrentUser, getUserType } from "../../Services/auth";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { getTag } from "../../Services/redux/skillTag/index";
import { createFilterOptions } from "@mui/material";
import { mdiCloseCircleOutline } from "@mdi/js";
import { skillsTag } from "../../Services/skillsTag";
import CreatableSelect from "react-select/creatable";

export default function AddSkillTags({ skillTagToPass }) {
  const dispatch = useDispatch();

  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );

  const [skillTag, setskillTag] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [focus, setFocus] = useState(false);
  const [skillsTags, setSkillsTags] = useState([]);
  

  //PROFILE SKILL TAG HOOCKS
  const [openAddEditSkills, setOpenAddEditSkills] = useState(false);
  const [skillTagData, setSkillTagData] = useState();
  const [skillToPass, setSkillToPass] = useState({});
  const [isReady, setIsReady] = useState(false);

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
    await dispatch(getTag(userAccountId))
      .then((response) => {
        setIsReady(true);
        setSkillTagData(response.payload.data);
      })
      .catch((error) => {});
  };

  const DeleteSkillTag = async (deleteId) => {
    Api()
      .delete(`/users/delete-tag/${deleteId}`)
      .then((response) => {
        setTimeout(async () => {
          await getUserTags();
        }, 200);
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
      });
  };

  const numberInputHandler = (e) => {
    const newTag = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setskillTag(newTag);
  };
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

  const handleCloseSnack = () => {
    setOpen(false);
  };

  // API REQUEST TO ADD SKILL
  const addSkillTag = async (e) => {
    if (skillsTags.length === 0) {
      setAlert({
        open: true,
        message: "Skill tag field is required",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
      return;
    }

    const data = {
      userAccountId: userAccountId,
      tags: skillsTags,
    };

    setloading(true);
    Api()
      .post("/users/tag/", data)
      .then((response) => {
        setloading(false);
        handleClose();
        setskillTag("");
        setTimeout(async () => {
          await getUserTags();
        }, 1000);
      })

      .catch((error) => {
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
        setOpen(true);
        closeAlert();
      });
      setSkillsTags([]);
  };

  const filter = createFilterOptions();

  const handleChange = (newValue, actionMeta) => {
    setSkillsTags(newValue.map(x => x.value))

  }

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
            <div className="d-flex justify-content-center align-item-center text-center mb-4 mt-5">
              <p>No skill tag has been added yet</p>
            </div>
          ) : (
            <div className="d-flex skill-tag-container">
              {skillTagData?.map((skillTag, index) => {
                return (
                  <>
                    <div className="d-flex flex-row mb-3">
                      <div
                        key={index}
                        className="job-badge-skill-tag d-flex align-item-center text-center"
                      >
                        <div> #{skillTag?.name?.replaceAll("&amp;", "&")}</div>
                        <div>
                          <Icon
                            className="skill-tag mb-1"
                            path={mdiCloseCircleOutline}
                            title="Delete"
                            size={0.5}
                            horizontal
                            vertical
                            color="#2E405B"
                            rotate={180}
                            type="button"
                            onClick={() => {
                              DeleteSkillTag(skillTag?.id);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                );
              })}
            </div>
          )}      

          <div className="row justify-content-center mt-5 mb-3">
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
          <div className="card-padding">
            <div align="right">
              <Icon
                path={mdiClose}
                size={1}
                horizontal
                vertical
                className="close"
                onClick={() => {
                  handleClose();
                }}
                rotate={180}
              />
            </div>
            <form onSubmit={addSkillTag}>
              <DialogContent 
              sx={focus && {height: "430px"}}
              >
                <div className="row justify-content-center text-center">
                  <p className="profile-headings">
                    <b>Add Skill Tags</b>
                  </p>
                  <div>
                    <Snackbar
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      open={open}
                      autoHideDuration={4000}
                      onClose={handleCloseSnack}
                    >
                      <Alert
                        severity={`${alert.severity}`}
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setAlert({
                                open: false,
                                message: "",
                                severity: "",
                              });
                            }}
                          ></IconButton>
                        }
                      >
                        {alert.message}
                      </Alert>
                    </Snackbar>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-12">
                  

                    <CreatableSelect
                      closeMenuOnSelect={false}
                      isMulti
                      options={skillsTag}
                      onMenuClose={() => {setFocus(false)}}
                      onChange={handleChange}
                      onMenuOpen={() => {setFocus(true)}}
                      
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="contained"
                    className="postJobbtn"
                    onClick={addSkillTag}                   
                    style={{
                      width: "145px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      flexWrap: "nowrap",
                    }}
                  >
                    {loading && (
                      <div>
                        <ClipLoader size={15} color="#1b98e0" loading />
                      </div>
                    )}
                    {loading ? "" : "Add Skill Tag"}
                  </Button>
                </div>
              </DialogContent>
            </form>
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
