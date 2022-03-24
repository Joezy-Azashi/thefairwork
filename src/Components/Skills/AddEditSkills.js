import React, { useState, useEffect } from "react";
import {
  Button,
  DialogContent,
  Dialog,
  Snackbar,
  TextField,
  MenuItem,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import Api from "../../Services/api";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { Proficiency } from "../../Services/validation";
import { getCurrentUser, getUserType } from "../../Services/auth";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

export default function AddEditSkills({ editMode, skillToPass, handleClose }) {
  const [id, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [userProfile, setUserProfile] = useState([]);
  const [category, setCategory] = useState(
    skillToPass?.mainCategory?.category === ""
      ? ""
      : skillToPass?.mainCategory?.id
  );
  const [personSkill, setPersonSkill] = useState(
    skillToPass?.subCategory?.category === ""
      ? ""
      : skillToPass?.subCategory?.id
  );
  const [proficiency, setProficiency] = useState(
    skillToPass?.proficiency === "" ? "" : skillToPass?.proficiency
  );

  const [testScore, setTestScore] = useState(skillToPass.testScore);

  const [skillData, setSkillData] = useState(skillToPass);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [accountId, setaccountId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [skillCategories, setskillCategories] = useState([]);
  const [subCategories, setsubCategories] = useState([]);

  const [categoryChecked, setCategoryChecked] = useState(false);
  const [skillChecked, setSkillChecked] = useState(false);
  const [skillCertified, setSkillCertified] = useState(
    skillToPass?.certifySkill
  );
  const [categoryCertified, setCategoryCertified] = useState(
    skillToPass?.certifyCategory
  );
  const [notLoaded, setnotLoaded] = useState(false);

  const [userType, setuserType] = useState(getUserType().accountTypeId === 3);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChangeCategoryCertified = (e) => {
    const categoryObject = skillCategories.find((item) => item.id === category);
    if (e.target.checked) {
      setCategoryCertified(!categoryCertified);

      localStorage.setItem(
        "categoryCertified",
        JSON.stringify(categoryObject?.category)
      );
      localStorage.setItem("category", JSON.stringify(!categoryCertified));
    }

    if (!e.target.checked) {
      setCategoryCertified(!categoryCertified);

      localStorage.setItem("categoryCertified", null);
      localStorage.setItem("category", false);
    }
  };

  const handleChangeSkillCertified = (e) => {
    const skillObject = subCategories.find((item) => item.id === personSkill);
    if (e.target.checked) {
      setSkillCertified(!skillCertified);
      localStorage.setItem(
        "skillCertify",
        JSON.stringify(skillObject.category)
      );
      localStorage.setItem("skill", JSON.stringify(!skillCertified));
    }

    if (!e.target.checked) {
      setSkillCertified(!skillCertified);
      localStorage.setItem("skillCertify", null);
      localStorage.setItem("skill", false);
    }
  };

  const handleChangeCategory = (e) => {
    const categoryObject = skillCategories.find((item) => item.id === category);
    if (e.target.checked) {
      setCategoryChecked(!categoryChecked);

      let data = {
        name: categoryObject?.category,
        link: categoryObject?.link,
      };
      localStorage.setItem("categoryLink", JSON.stringify(data));
    }

    if (!e.target.checked) {
      setCategoryChecked(!categoryChecked);
      localStorage.setItem("categoryLink", null);
    }
  };

  const handleChangeSkill = (e) => {
    const skillObject = subCategories.find((item) => item.id === personSkill);
    if (e.target.checked) {
      setSkillChecked(!skillChecked);
      let data = {
        name: skillObject?.category,
        link: skillObject?.link,
      };

      localStorage.setItem("skillLink", JSON.stringify(data));
    }

    if (!e.target.checked) {
      setSkillChecked(!skillChecked);

      localStorage.setItem("skillLink", null);
    }
  };

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

  const addOrUpdate = async () => {
    if (!editMode) {
      addSkill();
    } else {
      editSkill();
    }
  };

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfile(response?.data?.user);
      })
      .catch((error) => {});
  };

  // API REQUEST TO ADD SKILL
  const addSkill = async (e) => {
    const data = {
      userAccountId: accountId,
      categoryId: category ? category : null,
      skillId: personSkill ? personSkill : null,
      proficiency: proficiency,
      type: "IT Industry",
      testScore: testScore ? testScore : null,
      email: userProfile ? userProfile.email : getCurrentUser()?.user?.email,
      name:
        userProfile?.UserProfile?.firstname === "" ||
        userProfile?.UserProfile?.lastname === ""
          ? "User"
          : userProfile?.UserProfile?.firstname +
            " " +
            userProfile?.UserProfile?.lastname,
      categoryLink: JSON.parse(localStorage.getItem("categoryLink")),
      skillLink: JSON.parse(localStorage.getItem("skillLink")),
    };

    if (
      category === undefined ||
      personSkill === undefined ||
      proficiency === undefined
    ) {
      setAlert({
        open: true,
        message: "All fields are required ",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    } else {
      setloading(true);
      Api()
        .post("/users/post-user-skill/", data)
        .then((response) => {
          setloading(false);
          window.location.reload();
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
    }

    setTimeout(() => {
      localStorage.clear("categoryLink");
      localStorage.clear("skillLink");
    }, 2000);
  };

  const editSkill = async (e) => {
    const data = {
      id: skillData.id,
      userAccountId: accountId,
      type: "IT Industry",
      categoryId: category,
      skillId: personSkill,
      proficiency: proficiency,
      testScore: testScore ? testScore : null,
      certifyCategory: localStorage.getItem("category")
        ? JSON.parse(localStorage.getItem("category"))
        : false,
      certifySkill: localStorage.getItem("skill")
        ? JSON.parse(localStorage.getItem("skill"))
        : false,
      category: localStorage.getItem("categoryCertified")
        ? JSON.parse(localStorage.getItem("categoryCertified"))
        : null,
      skill: localStorage.getItem("skillCertify")
        ? JSON.parse(localStorage.getItem("skillCertify"))
        : null,
      name:
        userProfile?.UserProfile?.firstname === "" ||
        userProfile?.UserProfile?.lastname === ""
          ? "User"
          : userProfile?.UserProfile?.firstname +
            " " +
            userProfile?.UserProfile?.lastname,
      email: userProfile ? userProfile.email : getCurrentUser()?.user?.email,
      categoryLink: JSON.parse(localStorage.getItem("categoryLink")),
      skillLink: JSON.parse(localStorage.getItem("skillLink")),
    };

    setloading(true);
    Api()
      .put("/users/update-user-skill/", data)
      .then((response) => {
        setloading(false);
        window.location.reload();
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

    setTimeout(() => {
      localStorage.clear("categoryLink");
      localStorage.clear("skillLink");
    }, 2000);
  };

  const skillsCategories = () => {
    setnotLoaded(true);
    Api()
      .get(`/users/categories`)
      .then((response) => {
        setskillCategories(response?.data);
        setnotLoaded(false);

        //fetch sub categories and attach it
        const result = response?.data.find(
          ({ id }) => id === skillToPass?.mainCategory?.id
        );
        setsubCategories(result.Categories);
      })
      .catch((error) => {});
  };

  const subSkills = (categoryId) => {
    setCategory(categoryId);
    const result = skillCategories.find(({ id }) => id === categoryId);
    setsubCategories(result.Categories);
  };

  useEffect(() => {
    skillsCategories();
    getProfileData();
  }, []);

  return (
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
      <form onSubmit={addOrUpdate}>
        <DialogContent>
          <div className="row justify-content-center text-center">
            <h6>
              <b>{!editMode ? "Add Skill" : "Edit Skill"}</b>
            </h6>
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
                    >
                    </IconButton>
                  }
                >
                  {alert.message}
                </Alert>
              </Snackbar>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <TextField
                id="category"
                required
                asterisk
                variant="outlined"
                size="small"
                select
                label="Category"
                className=""
                fullWidth
                defaultValue={category || ""}
                onChange={(e) => subSkills(e.target.value)}
                style={{ textTransform: "capitalize" }}
              >
                {notLoaded ? (
                  <i style={{ margin: "0 10px" }}>Loading...</i>
                ) : (
                  skillCategories.map((cat) => {
                    return (
                      <MenuItem
                        style={{ textTransform: "capitalize" }}
                        value={cat.id}
                      >
                        {cat.category}
                      </MenuItem>
                    );
                  })
                )}
              </TextField>
            </div>
            {editMode &&
            userType &&
            skillToPass?.mainCategory?.link !== null ? (
              <div className="d-flex mt-2">
                <input
                  type="checkbox"
                  className=""
                  checked={categoryCertified}
                  onChange={handleChangeCategoryCertified}
                />
                <label
                  className=""
                  style={{
                    color: "#707070B2",
                    fontSize: "10.4px",
                    marginLeft: "5px",
                  }}
                >
                  Certified
                </label>
              </div>
            ) : !userType &&
              skillCategories.find((item) => item.id === category)?.link ? (
              <div className="d-flex mt-2">
                <input
                  type="checkbox"
                  className=""
                  checked={categoryChecked}
                  onChange={handleChangeCategory}
                />
                <label
                  className=""
                  style={{
                    color: "#707070B2",
                    fontSize: "10.4px",
                    marginLeft: "5px",
                  }}
                >
                  Please check this box if you want to certify this category by
                  taking a test. We will email you the test link.
                </label>
              </div>
            ) : (
              ``
            )}
          </div>
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <TextField
                id="personSkills"
                required
                asterisk
                variant="outlined"
                size="small"
                label="Skills"
                className=""
                select
                fullWidth
                defaultValue={personSkill || ""}
                onChange={(e) => setPersonSkill(e.target.value)}
                style={{ height: "40px", textTransform: "capitalize" }}
              >
                {category === undefined ? (
                  <i style={{ margin: "0 10px" }}>
                    Select category to see skills
                  </i>
                ) : (
                  subCategories.map((skill) => {
                    return (
                      <MenuItem
                        value={skill.id}
                        style={{ textTransform: "capitalize" }}
                      >
                        {skill.category}
                      </MenuItem>
                    );
                  })
                )}
              </TextField>
            </div>
            <div className="col-md-6 mb-2">
              <TextField
                id="personProficience"
                required
                asterisk
                variant="outlined"
                size="small"
                label="Proficiency"
                className=""
                select
                fullWidth
                defaultValue={proficiency || ""}
                onChange={(e) => setProficiency(e.target.value)}
                style={{ height: "40px", textTransform: "capitalize" }}
              >
                {Proficiency().map((pro) => {
                  return (
                    <MenuItem
                      value={pro.name}
                      style={{ textTransform: "capitalize" }}
                    >
                      {pro.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>

            {editMode && userType && skillToPass?.subCategory?.link !== null ? (
              <div className="d-flex mt-2">
                <input
                  type="checkbox"
                  className=""
                  checked={skillCertified}
                  onChange={handleChangeSkillCertified}
                />
                <label
                  className=""
                  style={{
                    color: "#707070B2",
                    fontSize: "10.4px",
                    marginLeft: "5px",
                  }}
                >
                  Certified
                </label>
              </div>
            ) : !userType &&
              subCategories.find((item) => item.id === personSkill)?.link ? (
              <div className="d-flex mt-2">
                <input
                  type="checkbox"
                  className=""
                  checked={skillChecked}
                  onChange={handleChangeSkill}
                  color="#2E405B"
                />
                <label
                  className=""
                  style={{
                    color: "#707070B2",
                    fontSize: "10.4px",
                    marginLeft: "5px",
                  }}
                >
                  Please check this box if you want to certify this skill by
                  taking a test. We will email you the test link.
                </label>
              </div>
            ) : (
              ``
            )}
          </div>


          <div className="d-flex justify-content-center mt-5">
            <Button
              variant="contained"
              className="postJobbtn"
              onClick={addOrUpdate}
            >
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={20} color="#1b98e0" loading />
                </div>
              )}
              {!editMode ? "Add Skills" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </form>
    </div>
  );
}
