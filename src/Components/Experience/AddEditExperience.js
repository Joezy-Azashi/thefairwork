import React, { useState, useEffect } from "react";
import {
  DialogContent,
  Button,
  Snackbar,
  TextField,
  MenuItem,
  ListSubheader,
  InputAdornment,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce/tinymce";
import IconButton from "@material-ui/core/IconButton";
import { getCurrentUser } from "../../Services/auth";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { useDispatch } from "react-redux";
import { getUserExperience } from "../../Services/redux/experience/index";
import SearchIcon from "@mui/icons-material/Search";

function AddEditExperience({ editMode, experienceToPass, handleClose }) {
  const [roleIsActive, setRoleIsActive] = useState(true);
  const dispatch = useDispatch();
  const [position, setPosition] = useState(
    experienceToPass.position === undefined ? "" : experienceToPass.position
  );
  const [company, setCompany] = useState(
    experienceToPass.company === undefined ? "" : experienceToPass.company
  );
  const [city, setCity] = useState(
    experienceToPass.city === undefined ? "" : experienceToPass.city
  );
  const [country, setCountry] = useState(
    experienceToPass?.countryId === undefined ? "" : experienceToPass?.countryId
  );
  const [responsibilities, setResponsibilities] = useState(
    experienceToPass.responsibilities === undefined
      ? ""
      : experienceToPass.responsibilities
  );

  const [countries, setCountries] = useState([]);
  const [from, setFrom] = useState(
    experienceToPass.from === undefined
      ? ""
      : moment(`${experienceToPass.from}`).format("YYYY-MM-DD")
  );
  const [to, setTo] = useState(
    experienceToPass.to === undefined || null
      ? ""
      : moment(`${experienceToPass.to}`).format("YYYY-MM-DD")
  );
  const [loadEditor, setLoadEditor] = useState(true);
  const [expData, setExpData] = useState(experienceToPass);
  const [loading, setloading] = useState(false);
  const [accountId, setaccountId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [limit, setLimit] = useState();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState(
    experienceToPass?.countryId ? experienceToPass?.Country : ""
  );

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

  const getExperience = async () => {
    await dispatch(getUserExperience(accountId));
  };

  const addOrUpdate = async () => {
    if (!editMode) {
      addExperience();
    } else {
      editExperience();
    }
  };

  const containsText = (text, searchtext) =>
    text.toLowerCase().includes(searchtext.toLowerCase());

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;

  const handleSummary = (value) => {
    setResponsibilities(value);
    setLimit(false);
  };

  const getCountries = async () => {
    Api()
      .get("/users/get-countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {});
  };

  const handleRole = ()=>{
    setRoleIsActive(prevState=>!prevState);

    if(roleIsActive){
      setTo(null);
    }
  };

  // API REQUEST TO ADD EDUCATION
  const addExperience = async (e) => {
    const data = {
      userAccountId: accountId,
      position: position,
      countryId: country === "" ? null : country,
      company: company,
      from: moment(`${from}`).format("YYYY-MM-DD"),
      to: to === null ? null :moment(`${to}`).format("YYYY-MM-DD") ,
      city: city,
      responsibilities: responsibilities,
    };

    if (
      position.trim().length === 0 ||
      company.trim().length === 0 ||
      responsibilities.trim().length === 0 ||
      from === "" ||
      to === ""
    ) {
      setAlert({
        open: true,
        message: "All fields are required except city and country",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    } else if (
      responsibilities?.length < 120 ||
      responsibilities?.length > 2000
    ) {
      setLimit(true);
      setAlert({
        open: true,
        message:
          "Resposibilites should be 120 characters minimum or up to 2000 characters",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    } else {
      setloading(true);
      Api()
        .post("/users/post-user-experience", data)
        .then((response) => {
          setloading(false);
          setTimeout(async () => {
            await getExperience();
            handleClose();
          }, 200);
        })
        .catch((error) => {
          setloading(false);
          setOpen(true);
          setAlert({
            open: true,
            message: `${error.response.data.error}`,
            severity: "error",
          });
          closeAlert();
        });
    }
  };

  const editExperience = async (e) => {
    const data = {
      id: expData.id,
      userAccountId: accountId,
      countryId: country,
      position: position,
      company: company,
      from: moment(`${from}`).format("YYYY-MM-DD"),
      to: to === null ? null : moment(`${to}`).format("YYYY-MM-DD"),
      // to: moment(`${to}`).format("YYYY-MM-DD"),
      city: city,
      responsibilities: responsibilities,
    };

    if (
      position === "" ||
      company === "" ||
      responsibilities === "" ||
      from === "" ||
      to === ""
    ) {
      setAlert({
        open: true,
        message: "All fields are required except city and country",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    } else if (
      responsibilities?.length < 120 ||
      responsibilities?.length > 2000
    ) {
      /* setLimit(true); */
      setAlert({
        open: true,
        message:
          "Resposibilites should be 120 characters minimum or up to 2000 characters",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    } else {
      setloading(true);
      Api()
        .put("/users/update-user-experience", data)
        .then((response) => {
          setloading(false);
          setTimeout(async () => {
            await getExperience();
            handleClose();
          }, 200);
        })
        .catch((error) => {
          setloading(false);
          setOpen(true);
          setAlert({
            open: true,
            message: `${error.response.data.error}`,
            severity: "error",
          });
          closeAlert();
        });
    }
  };

  useEffect(() => {
    getCountries();
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
              <b>{!editMode ? "Add Experience" : "Edit Experience"}</b>
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
                    ></IconButton>
                  }
                >
                  {alert.message}
                </Alert>
              </Snackbar>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <TextField
                id="position"
                required
                asterisk
                label="Position"
                type="text"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={position || ""}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-4">
              <TextField
                id="company"
                required
                asterisk
                label="Company"
                type="text"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={company || ""}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="row ">
            <div className="col-md-6 mb-4">
              <TextField
                id="city"
                label="City"
                type="text"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={city || ""}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-4">
              <TextField
                id="country"
                label="Country"
                select
                variant="outlined"
                size="small"
                className=""
                fullWidth
                MenuProps={{ autoFocus: false }}
                value={country || ""}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setSelectedOption(
                    countries?.find((x) => x.id === e.target.value)
                  );
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 157,
                        anchorPosition: { top: 0, left: 400 },
                      },
                    },
                  },
                  renderValue: () => <> <img width={20} src={(countries?.find(x => x.id === country))?.image}/> {(countries?.find(x => x.id === country))?.name}</> 
                }}
              >
                <ListSubheader>
                  <TextField
                    size="small"
                    label=" "
                    autoFocus
                    placeholder="Type to search..."
                    fullWidth
                    variant="outlined"
                    style={{ marginTop: 5, marginBottom: 0 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        // Prevents autoselecting item while typing (default Select behaviour)
                        e.stopPropagation();
                      }
                    }}
                  />
                </ListSubheader>
                {countries
                  ?.filter((x) => containsText(x.name, searchText))
                  ?.map((count) => {
                    return (
                      <MenuItem key={count.id} value={count.id}>
                        <img width={20} src={count.image} />
                        {count?.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <TextField
                id="start-date"
                required
                asterisk
                type="date"
                label="From"
                variant="outlined"
                className=""
                InputLabelProps={{ shrink: true }}
                size="small"
                InputProps={{ inputProps: { min: "", max: to ? to : today } }}
                fullWidth
                defaultValue={moment(`${from}`).format("YYYY-MM-DD") || ""}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-4">
              <TextField
                id="end-date"
                required
                asterisk
                disabled = {!roleIsActive}
                type="date"
                variant="outlined"
                className=""
                InputLabelProps={{ shrink: true }}
                label="To"
                size="small"
                InputProps={{ inputProps: { min: from ? from : "", max: "" } }}
                fullWidth
                defaultValue={moment(`${to}`).format("YYYY-MM-DD") || ""}
                onChange={(e) => setTo(e.target.value)}
              />
              {/* <div>{!roleIsActive && "Present"}</div> */}
              <div>
                <input type="checkbox" value={roleIsActive} onChange = {handleRole}/>
                <label
                  style={{
                    fontFamily: '"Segoe UI", sans-serif',
                    color: "rgb(85, 85, 85)",
                    marginLeft: "5px",
                  }}
                >
                  I am currently working in this role
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {loadEditor && (
              <div className="d-flex justify-content-center align-item-center mt-5">
                <ClipLoader size={40} color="#1b98e0" loading />
              </div>
            )}
            <div className="col-md-12">
              <Editor
                apiKey="jnq6bu3a3gvvn2nvdtz5e65m7ffttui7jqw5pgo6wvksdzo1"
                value={responsibilities || ""}
                onInit={() => {
                  setLoadEditor(false);
                }}
                init={{
                  placeholder:
                    "Responsibilities (120 characters minimum or up to 2000 characters)",
                  height: 245,
                  menubar: false,
                  resize: false,
                  statusbar: false,
                  theme_advanced_buttons1_add: "media",
                  plugins: [
                    "advlist autolink lists link image media charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                    "paste",
                  ],
                  automatic_uploads: true,
                  relative_urls: true,
                  font_formats: "Segoe UI=Segoe UI; Sans-serif= sans-serif",

                  toolbar:
                    "undo redo | formatselect | fontselect | fontsizeselect |" +
                    "alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help ",

                  image_title: true,

                  file_picker_types: "image media",

                  file_picker_callback: function (cb, value, meta) {
                    var input = document.createElement("input");
                    input.setAttribute("type", "file");
                    input.setAttribute("accept", "");

                    input.onchange = function () {
                      var file = this.files[0];

                      var reader = new FileReader();
                      reader.onload = function () {
                        var id = "blobid" + new Date().getTime();
                        var blobCache =
                          tinymce.activeEditor.editorUpload.blobCache;
                        var base64 = reader.result.split(",")[1];
                        var blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);

                        cb(blobInfo.blobUri(), { title: file.name });
                      };
                      reader.readAsDataURL(file);
                    };

                    input.click();
                  },
                  content_style:
                    "body { font-family:Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats }",
                }}
                onEditorChange={handleSummary}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Button variant="contained" className="btn" onClick={addOrUpdate}>
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={20} color="#1b98e0" loading />
                </div>
              )}
              {!editMode ? "Add Experience" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </form>
    </div>
  );
}

export default AddEditExperience;
