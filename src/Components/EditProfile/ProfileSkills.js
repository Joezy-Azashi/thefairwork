import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Dialog,
  Chip,
  DialogContent,
} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import AddEditSkills from "../../Components/Skills/AddEditSkills";
import AddEditGhanaSkills from "../Skills/AddEditGhanaSkills";
import Api from "../../Services/api";
import { getCurrentUser } from "../../Services/auth";
import DeleteSkills from "../../Components/Skills/DeleteSkills";
import { ClipLoader } from "react-spinners";
import Icon from "@mdi/react";
import {
  mdiSquareEditOutline,
  mdiDeleteOutline,
  mdiCheckboxMarkedCircle,
} from "@mdi/js";
import ChooseIndustryPrompt from "../Skills/ChooseIndustryPrompt";
import { getSkillIndustryType } from "../../Services/redux/skills/index";
import { skillsReducer } from "../../Services/redux/skills/skills_slice";
import EditGCATest from "../Skills/EditGCATest";
import DeleteGCATest from "../Skills/DeleteGCSTest";

export default function ProfileSkills() {
  const GCATEST = useSelector(skillsReducer);
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );

  const dispatch = useDispatch();
  const [userAccount, setuserAccount] = useState(
    getCurrentUser()?.user?.accountTypeId
  );
  const [openAddEditSkills, setOpenAddEditSkills] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openGhanaSkills, setOpenGhanaSkills] = useState(false);
  const [skillsData, setSkillsData] = useState();
  const [skillToPass, setSkillToPass] = useState({});
  const [profileId, setProfileId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [industries, setIndustries] = useState([]);
  const [skillType, setskillType] = useState("");
  const [openPrompt, setopenPrompt] = useState(false);
  const [openConfirmIndustry, setopenConfirmIndustry] = useState(false);
  const [IndustryId, setIndustryId] = useState();
  const [openGCA, setOpenGCA] = useState(false);
  const [GCDTestId, setGCDTestId] = useState("");
  const [openDeleteGCA, setOpenDeleteGCA] = useState(false);
  const [GCADataForEdit, setGCADataForEdit] = useState("");

  const [userSkillData, setuserSkillData] = useState({});

  const [userIndustryType, setuserIndustryType] = useState();

  // HOOKS TO TOGGLE BETWEEN ADD AND EDIT MODE
  const [editMode, seteditMode] = useState(false);

  const handleOpenAddEditSkills = () => {
    setOpenAddEditSkills(true);
    seteditMode(false);
    setSkillToPass({});
  };

  const openGCADelete = () => {
    setOpenDeleteGCA(true);
  };

  const closeGCADelete = () => {
    setOpenDeleteGCA(false);
  };

  const openGCADia = () => {
    setOpenGCA(true);
  };

  const closeGCADia = () => {
    setOpenGCA(false);
  };

  const openpromptDialog = () => {
    setopenPrompt(true);
  };

  const closepromptDialog = () => {
    setopenPrompt(false);
  };

  const openConfirmDialog = () => {
    setopenConfirmIndustry(true);
  };

  const closeConfirmDialog = () => {
    setopenConfirmIndustry(false);
    setskillType("");
  };

  const handleOpenAddEditGhanaSkills = () => {
    setOpenGhanaSkills(true);
    seteditMode(false);
    setSkillToPass({});
  };

  const saveSkillType = (value) => {
    setskillType(value);
    setuserSkillData(value);
  };

  const getIndustries = async () => {
    Api()
      .get(`/users/industries`)
      .then((response) => {
        setIsReady(true);
        if (typeof response.data === "object") {
          setIndustries(["None"]);
        } else {
          setIndustries(response?.data);
        }
      })
      .catch((error) => {});
  };

  const handleClose = () => {
    setOpenAddEditSkills(false);
  };

  const handleCloseGhana = () => {
    setOpenGhanaSkills(false);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const handleChange = (e) => {
    saveSkillType(e.target.value);
    openConfirmDialog();
  };

  const getIndustryType = async () => {
    await dispatch(getSkillIndustryType(userAccountId))
      .then((response) => {
        setuserIndustryType(response.payload.data.type);
      })
      .catch((error) => {});
  };

  const addIndustry = async (e) => {
    e.preventDefault();
    const data = {
      userAccountId: userAccountId,
      type: skillType === `IT Industry` ? `IT Industry` : skillType?.name,
    };

    Api()
      .post("/users/post-skill-type", data)
      .then((response) => {})
      .catch((error) => {});

    setTimeout(async () => {
      await getIndustryType();
    }, 1000);
    closeConfirmDialog();
    // window.location.reload()
    localStorage.setItem("skillTypeData", JSON.stringify(skillType));
  };

  const getUserSkills = async () => {
    Api()
      .get(`/users/get-user-skills/${userAccountId}`)
      .then((response) => {
        setIsReady(true);
        setSkillsData(response.data);
        setIndustryId(response.data[0]?.industryId);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getUserSkills();
    getIndustries();
    getIndustryType();
  }, []);

  return (
    <div>
      <Card className="mb-5 pb-4">
        <CardContent className="p-5 pb-5">
          <div className="row justify-content-between">
            <div className="col-md-9">
              <p className="profile-headings">
                <b>Skills</b>
              </p>
            </div>

            <div className="col-md-3">
              {userIndustryType?.length > 0 ? (
                <TextField
                  id="industry"
                  type="text"
                  variant="outlined"
                  label="Selected Industry"
                  size="small"
                  disabled
                  className="profileSelectIndustry"
                  defaultValue={userIndustryType}
                  fullWidth
                  style={{
                    textTransform: "capitalize",
                  }}
                ></TextField>
              ) : (
                <TextField
                  id="industry"
                  type="text"
                  variant="outlined"
                  label="Select Industry"
                  size="small"
                  className="profileSelectIndustry"
                  select
                  value={skillType}
                  fullWidth
                  onChange={handleChange}
                  style={{ textTransform: "capitalize" }}
                >
                  <MenuItem
                    style={{ textTransform: "capitalize" }}
                    value={`IT Industry`}
                  >
                    IT Industry
                  </MenuItem>
                  {industries?.map((industry, index) => {
                    return (
                      <MenuItem
                        key={index}
                        style={{ textTransform: "capitalize" }}
                        value={industry}
                      >
                        {industry?.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              )}
            </div>
          </div>
          <hr />

          <div>
            {GCATEST?.data?.GCAs?.map((GCA, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-md-6">
                      <div className="d-flex job-title skillSpace">
                        <p className="profile-headings">
                          <b>{GCA?.name}</b>{" "}
                          {GCA?.isCertified ? (
                            <>
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
                                className="skillChipWeb"
                                label="Certified"
                                variant="outlined"
                              />
                            </>
                          ) : (
                            ``
                          )}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p className="mr-2">{GCA?.proficiency}</p>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                      <div>
                        {userAccount === 3 ? (
                          <Icon
                            path={mdiSquareEditOutline}
                            title="Edit"
                            size={1}
                            color="#2E405B"
                            horizontal
                            vertical
                            rotate={180}
                            type="button"
                            onClick={() => {
                              openGCADia();
                              setGCADataForEdit(GCA);
                            }}
                          />
                        ) : (
                          ``
                        )}
                      </div>
                      <div>
                        {userAccount === 3 ? (
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
                              openGCADelete();
                              setGCDTestId(GCA?.id);
                            }}
                          />
                        ) : (
                          ``
                        )}
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              );
            })}
          </div>
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : skillsData?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No skills has been added yet</p>
            </div>
          ) : (
            skillsData?.map((skills, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-md-9">
                      <div className="job-title skillSpace skillSet">
                        <p className="profile-headings mobileSpace">
                          <b>
                            {skills?.mainCategory?.name
                              ? skills?.mainCategory?.name
                              : skills?.mainCategory?.category}
                          </b>{" "}
                          {skills.certifyCategory || skills.certifyIndustry ? (
                            <>
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
                                    style={{ marginBottom: "3px" }}
                                  />
                                }
                                style={{
                                  background: "#009E2026",
                                  color: "#009E20",
                                  height: "20px",
                                  marginBottom: "1px",
                                }}
                                className="skillChipWeb"
                                label="Certified"
                                variant="outlined"
                              />

                              <Icon
                                path={mdiCheckboxMarkedCircle}
                                size={0.6}
                                horizontal
                                vertical
                                color="#009E20"
                                rotate={180}
                                type="button"
                                className="skillChipMobile"
                              />
                            </>
                          ) : (
                            ``
                          )}
                        </p>
                        <p className="exdivider"> - </p>
                        <p className="profile-headings mobileSpace">
                          <b>
                            {skills?.subCategory?.name
                              ? skills?.subCategory?.name
                              : skills?.subCategory?.category}
                          </b>{" "}
                          {skills.certifySubIndustry || skills.certifySkill ? (
                            <>
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
                                    style={{ marginBottom: "3px" }}
                                  />
                                }
                                style={{
                                  background: "#009E2026",
                                  color: "#009E20",
                                  height: "20px",
                                  marginBottom: "4px",
                                }}
                                className="skillChipWeb"
                                label="Certified"
                                variant="outlined"
                              />

                              <Icon
                                path={mdiCheckboxMarkedCircle}
                                size={0.6}
                                horizontal
                                vertical
                                color="#009E20"
                                rotate={180}
                                type="button"
                                className="skillChipMobile"
                              />
                            </>
                          ) : (
                            ``
                          )}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p className="mr-2 mobileSpace">
                          {skills?.proficiency}
                        </p>
                      </div>
                    </div>
                    <div className="col-12 col-md-2 d-flex editDelete mobileSpace">
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
                            setSkillToPass(skills);
                            userIndustryType !== "IT Industry"
                              ? setOpenGhanaSkills(true)
                              : setOpenAddEditSkills(true);
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
                            setDeleteId(skills?.id);
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

          {userIndustryType === null ? (
            <div className="row justify-content-center mt-5 mb-3">
              <div className="col-md-12">
                <Button
                  style={{ color: "#2E405B" }}
                  className="btn-text"
                  onClick={openpromptDialog}
                  startIcon={<AddIcon />}
                >
                  Add Skills
                </Button>
              </div>
            </div>
          ) : userIndustryType === "IT Industry" ||
            skillType === "IT Industry" ? (
            <div className="row justify-content-center mt-5 mb-3">
              <div className="col-md-12">
                <Button
                  className="btn-text"
                  onClick={handleOpenAddEditSkills}
                  startIcon={<AddIcon />}
                >
                  Add Skills
                </Button>
              </div>
            </div>
          ) : userIndustryType !== "IT Industry" ||
            skillType !== "IT Industry" ? (
            <div className="row justify-content-center mt-5 mb-3">
              <div className="col-md-12">
                <Button
                  style={{ color: "#2E405B" }}
                  className="btn-text"
                  onClick={handleOpenAddEditGhanaSkills}
                  startIcon={<AddIcon />}
                >
                  Add Skills
                </Button>
              </div>
            </div>
          ) : (
            ``
          )}
        </CardContent>

        {/* DIALOG FOR DELETING OF SKILLS */}
        <Dialog
          open={openDeleteDialog}
          onClose={closeDeleteDia}
          //disableBackdropClick
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <DeleteSkills
            deleteId={deleteId}
            closeDeleteDia={closeDeleteDia}
            userIndustryType={userIndustryType}
          />
        </Dialog>

        {/* DIALOG FOR DELETING OF GCA TEST */}
        <Dialog
          open={openDeleteGCA}
          onClose={closeGCADelete}
          //disableBackdropClick
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <DeleteGCATest
            deleteId={GCDTestId}
            closeGCADelete={closeGCADelete}
            userAccountId={userAccountId}
          />
        </Dialog>

        {/* DIALOG FOR EDITING OF GCA TEST */}
        <Dialog
          open={openGCA}
          onClose={closeGCADia}
          disableBackdropClick
          fullWidth
          maxWidth="sm"
          className="dialogborder"
        >
          <EditGCATest
            GCADataForEdit={GCADataForEdit}
            closeGCADia={closeGCADia}
            userAccountId={userAccountId}
          />
        </Dialog>

        {/* DIALOG FOR CONFIRMING AN INDUSTRY */}
        <Dialog
          open={openConfirmIndustry}
          onClose={closeDeleteDia}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <div>
            <DialogContent className="text-center p-4">
              <form onSubmit={addIndustry}>
                <p>
                  You have selected{" "}
                  {skillType === "IT Industry" ? (
                    <span
                      style={{
                        textTransform: "capitalize",
                        color: "#2E405B",
                        fontWeight: "600",
                      }}
                    >
                      IT Industry
                    </span>
                  ) : (
                    <span
                      style={{
                        textTransform: "capitalize",
                        color: "#2E405B",
                        fontWeight: "600",
                      }}
                    >
                      {skillType?.name}
                    </span>
                  )}{" "}
                  as your industry. You won't be able to change your industry
                  later. Please select what matches your profile the most.
                </p>

                <div className="row justify-content-center text-center">
                  <div className="col-md-2" />
                  <div className="col-md-4 mb-3">
                    <Button
                      className="btn w-100"
                      variant="outlined"
                      onClick={() => {
                        closeConfirmDialog();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="col-md-4">
                    <Button variant="outlined" className="w-100" type="submit">
                      Confirm
                    </Button>
                  </div>
                  <div className="col-md-2" />
                </div>
              </form>
            </DialogContent>
          </div>
        </Dialog>

        {/* DIALOG FOR DISPLAYING WHAT POP UP SHOULD SHOW BASED ON INDUSTRY CHOOSEN */}

        {userIndustryType === null ? (
          <Dialog
            open={openPrompt}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="xs"
            className="dialogborder"
          >
            <ChooseIndustryPrompt closepromptDialog={closepromptDialog} />
          </Dialog>
        ) : (
          <Dialog
            open={
              userIndustryType === "IT Industry" || skillType === "IT Industry"
                ? openAddEditSkills
                : openGhanaSkills
            }
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
            className="dialogborder"
          >
            {userIndustryType === "IT Industry" ||
            skillType === "IT Industry" ? (
              <AddEditSkills
                editMode={editMode}
                skillToPass={skillToPass}
                profileId={profileId}
                handleClose={handleClose}
              />
            ) : (
              <AddEditGhanaSkills
                editMode={editMode}
                skillToPass={skillToPass}
                profileId={profileId}
                handleClose={handleCloseGhana}
                userSkillData={userSkillData}
                userIndustryType={userIndustryType}
                IndustryId={IndustryId}
              />
            )}
          </Dialog>
        )}
      </Card>
    </div>
  );
}
