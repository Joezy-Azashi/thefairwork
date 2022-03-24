import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Snackbar,
  InputAdornment,
  TextField,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import { recruiterRole } from "../../Services/userTypes";
import { ClipLoader } from "react-spinners";
import IconButton from "@material-ui/core/IconButton";
import { getUserType } from "../../Services/auth";
import UploadProfileImage from "../UploadProfileImage";
import FileUploadService from "../../Services/fileUpload";
import { mdiPaperclip } from "@mdi/js";
import Icon from "@mdi/react";
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import formatPaymentLevel from "../../Services/paymentLevels";
import SearchIcon from "@mui/icons-material/Search";

function Profile({ resunmeTopass }) {
  const history = useHistory();
  const [userProfile, setuserProfile] = useState(
    JSON.parse(localStorage.getItem("userDetails")) !== null
      ? JSON.parse(localStorage.getItem("userDetails"))
      : []
  );
  const [userAccountId, setUserAccountId] = useState(
    userProfile?.UserProfile?.userAccountId
  );
  const [city, setCity] = useState(userProfile?.UserProfile?.city);
  const [company, setCompany] = useState(userProfile?.UserProfile?.company);
  const [country, setCountry] = useState(userProfile?.UserProfile?.countryId);
  const [summary, setSummary] = useState(userProfile?.UserProfile?.summary);
  const [firstName, setFirstName] = useState(
    userProfile?.UserProfile?.firstname
  );
  const [lastName, setLastName] = useState(userProfile?.UserProfile?.lastname);
  const [phone, setPhone] = useState(userProfile?.UserProfile?.phone);
  const [countryCode, setCountryCode] = useState(
    userProfile?.UserProfile?.countryCode
  );
  const [availability_link, setAvailability_link] = useState(
    userProfile?.UserProfile?.availability_link
  );

  const [region_state_province, setRegion_state_province] = useState(
    userProfile?.UserProfile?.region_state_province
  );
  const [street_1, setStreet_1] = useState(userProfile?.UserProfile?.street_1);
  const [street_2, setStreet_2] = useState(userProfile?.UserProfile?.street_2);
  const [website, setWebsite] = useState(userProfile?.UserProfile?.website);
  const [countries, setCountries] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [limit, setLimit] = useState();

  const [role, setRole] = useState(userProfile?.UserProfile?.role);
  const [cv, setCV] = useState();
  const [linkedIn, setLinkedIn] = useState(userProfile?.UserProfile?.linkedIn);
  const [github, setGithub] = useState(userProfile?.UserProfile?.github);
  const [paymentLevel, setPaymentLevel] = useState([]);
  const [selpaymentLevel, setSelPaymentLevel] = useState(
    userProfile?.PaymentLevel?.id
  );
  const [paymentValue, setPaymentValue] = useState(
    userProfile?.paymentValue || null
  );
  const [isReady, setIsReady] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileLoading, setFileLoading] = useState(true);

  const websiteRef = useRef(null);
  const githubRef = useRef(null);
  const linkedinRef = useRef(null);

  const freelance = localStorage.getItem("freelancers");
  const [searchText, setSearchText] = useState("");
  const [searchCodeText, setSearchCodeText] = useState("");
  const [coCode, setCoCode] = useState(null);

  const containsText = (text, searchText) =>
    text.toLowerCase().includes(searchText.toLowerCase());

  const [fileUrl, setFileUrl] = useState(
    resunmeTopass?.file?.length > 0
      ? resunmeTopass?.file[0].split("/")[
          resunmeTopass?.file[0].split("/").length - 1
        ]
      : ""
  );

  const [fileName, setfileName] = useState(
    userProfile?.UserProfile?.CV === null
      ? "Click here to upload CV"
      : userProfile?.UserProfile?.CV.split("/")[3]
  );

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setloading] = useState(false);
  const [validationOkay, setValidationOkay] = useState(false);

  const getUserPaymentLevel = async () => {
    Api()
      .post(`admin/all-payment-levels`)

      .then((response) => {
        setIsReady(true);
        setPaymentLevel(response?.data);
      })
      .catch((error) => {});
  };

  const getCountries = async () => {
    Api()
      .get("/users/get-countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => setCountries([]));
  };

  const handleSummary = (e) => {
    setSummary(e.target.value);
    setLimit(false);
  };

  const handleChange = (e) => {
    setSelPaymentLevel(e.target.value);
  };
  const reverseValidation = () => {
    setValidationOkay(false);
  };
  const confirmValidation = () => {
    setValidationOkay(true);
  };

  const editProfile = async (e) => {
    e.preventDefault();
    if(getUserType().accountTypeId === 3){
      if(!selpaymentLevel && paymentValue){
        setOpen(true)
        setAlert({
          open: true,
          message: `Payment Value cannot be set when Payment Level is empty`,
          severity: "error",
        });
        return        
      }
      else if(selpaymentLevel && !paymentValue){
        setOpen(true)
        setAlert({
          open: true,
          message: `Payment Value must be set when Payment Level is set`,
          severity: "error",
        });
        return        
      }
    }

    updatePayment()
      .then((response) => {
        const profileDetails = {
          id: userProfile.id,
          city: city,
          company: company === null ? "" : company,
          summary: summary,
          firstname: firstName,
          lastname: lastName,
          email: userProfile.email,
          street_1: street_1,
          street_2: street_2,
          phone: phone,
          countryCode: countryCode,
          website: website === null ? "" : website,
          countryId: country === undefined ? null : country,
          region_state_province: region_state_province,
          role: role,
          github: github === null ? "" : github,
          linkedIn: linkedIn === null ? "" : linkedIn,
          CV: fileUrl.data,
          availability_link: availability_link,
          level: paymentLevel,
        };

        if (summary?.length < 120 || summary?.length > 1000) {
          setLimit(true);
        } else if (website?.length > 0 && !website.includes(".")) {
          setOpen(true);
          setAlert({
            open: true,
            message: "Website URL format is incorrect",
            severity: "error",
          });
        } else if (
          linkedIn?.length > 0 &&
          !linkedIn.includes("linkedin.com/in/")
        ) {
          setOpen(true);
          setAlert({
            open: true,
            message: "LinkedIn URL format is incorrect",
            severity: "error",
          });
        } else if (github?.length > 0 && !github.includes("github.com/")) {
          setOpen(true);
          setAlert({
            open: true,
            message: "Github URL format is incorrect",
            severity: "error",
          });
        } else {
          setloading(true);
          Api()
            .post("/users/update-bio/", profileDetails)
            .then((response) => {
              setloading(false);
              history.push("/profile", {
                params: "client",
              });
            })
            .catch((error) => {
              setloading(false);
              setAlert({
                open: true,
                message: `${error?.response?.data?.error}`,
                severity: "error",
              });
              setOpen(true);
            });
        }
      })
      .catch((error) => {});
  };

  const [waiting, setWaiting] = useState(false);

  const fileValidation = (fileType) => {
    const acceptedExt = [
      "mp4",
      "pdf",
      "xlx",
      "xlsx",
      "csv",
      "jpg",
      "jpeg",
      "png",
      "jfif",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "psd",
      "eps",
      "xd",
      "fig",
    ];
    return acceptedExt.findIndex(
      (item) => fileType.toLowerCase() === item.toLowerCase()
    );
  };

  const uploadImage = (event) => {
    setNewFileName(event.target.files[0]?.name);
    const fileType =
      event.target.files[0].name.split(".")[
        event.target.files[0].name.split(".").length - 1
      ];
    const result = fileValidation(fileType);
    if (result < 0) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Invalid file type",
        severity: "error",
      });
    } else if (event.target.files[0].size > 5000000) {
      setAlert({
        open: true,
        message: "File size can not be more than 5MB",
        severity: "error",
      });
      setOpen(true);
    } else {
      setWaiting(true);
      setFileLoading(true);
      const url = `/upload-file-form`;
      FileUploadService.uploadGeneral(event.target.files[0], url)
        .then((response) => {
          setFileUrl(response);
          setWaiting(false);
        })
        .catch((error) => {});
    }
  };

  const updatePayment = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          levelId: selpaymentLevel,
          paymentValue,
        };

        const res = await Api().put(
          `admin/update-user-payment-level/${userAccountId}`,
          data
        );
        if (res.data) {
          resolve(res);
        } else {
          reject(res);
        }
      } catch (error) {
        setloading(false);
        setAlert({
          open: true,
          message: `${error?.response?.data?.errors[0]}`,
          severity: "error",
        });
        setOpen(true);
      }
    });
  };

  const handleClick = () => {
    history.push("/profile", {
      params: "client",
    });
  };

  const handlePaymentValue = ({ target }) => {
    setPaymentValue(target.value);
  };

  useEffect(() => {
    getCountries();
    if(getUserType().accountTypeId === 2 || getUserType().accountTypeId === 3){
      getUserPaymentLevel();
    }
  }, []);

  return (
    <div>
      <form onSubmit={editProfile} autoComplete="off">
        <div class="ProfileChangesBtnContainer mb-5">
          <div className="d-flex p-1">
            {userProfile?.accountTypeId === 2 ? (
              <NavLink
                to="/profile"
                style={{ textDecoration: "none" }}
                className="saveProfileChangesBtn"
              >
                <Button
                  variant="outlined"
                  className="saveProfileChangesBtn"
                  fullWidth
                  style={{ color: "#2E405B" }}
                >
                  View Profile
                </Button>
              </NavLink>
            ) : (
              <Button
                className="saveProfileChangesBtn"
                variant="outlined"
                fullWidth
                style={{ color: "#2E405B" }}
                onClick={() => {
                  handleClick();
                }}
              >
                View Profile
              </Button>
            )}
          </div>
        </div>
        <Card className="mb-5 pb-4 ">
          <CardContent className="profileCardPadding">
            <h6>
              <b>Profile Details</b>
            </h6>
            <hr />
            <div>
              <Snackbar
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
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

            <div
              className={
                getUserType().accountTypeId === 2 ||
                getUserType().accountTypeId === 3
                  ? "row mb-4 mt-4"
                  : "d-flex justify-content-center align-items-center mb-4 mt-4"
              }
            >
              <div className="col-md-3 col-sm-12 px-0">
                <div className="profileAvatar">
                  <UploadProfileImage />
                </div>
              </div>
              {getUserType().accountTypeId === 2 ||
              getUserType().accountTypeId === 3 ? (
                <div className="col-md-9 col-sm-12 mt-4 ml-4">
                  <TextField
                    rows={6}
                    id="summary"
                    label="Summary pitch (120 to 1000 characters)"
                    required
                    asterisk
                    type="text"
                    variant="outlined"
                    multiline
                    fullWidth
                    className=""
                    defaultValue={summary || ""}
                    onChange={handleSummary}
                    helperText={
                      limit ? (
                        <div className="mb-2 ">
                          <p className="error-text">
                            120 characters minimum or up to 1000 characters
                          </p>
                        </div>
                      ) : summary?.length > 0 ? (
                        <div className=" ">
                          {summary?.length > 0 && summary?.length < 1000 ? (
                            <p style={{ color: "#2E405B" }}>
                              {summary.length}{" "}
                              <span>
                                {" "}
                                characters (minimum of 120 characters)
                              </span>
                            </p>
                          ) : (
                            <div className="">
                              <p className="error-text">
                                120 characters minimum or up to 1000 characters
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        ``
                      )
                    }
                  />
                </div>
              ) : (
                ``
              )}
            </div>

            <div className="row mt-4">
              <div className="col-md-6 mb-4 profile-error">
                {/* <label>First Name</label> */}
                <TextField
                  id="fname"
                  label="First name"
                  required
                  asterisk
                  type="text"
                  variant="outlined"
                  size="small"
                  fullWidth
                  className=""
                  defaultValue={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
              </div>

              <div className="col-md-6 mb-4">
                <TextField
                  id="lname"
                  label="Last name"
                  required
                  asterisk
                  type="text"
                  variant="outlined"
                  size="small"
                  className=""
                  fullWidth
                  defaultValue={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {recruiterRole() ? (
              <>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <TextField
                      id="companyName"
                      label="Company name"
                      required
                      asterisk
                      type="text"
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      defaultValue={company?.replaceAll("&amp;", "&")}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      defaultValue={userProfile?.email}
                      disabled
                    />
                  </div>
                </div>
              </>
            ) : null}

            {getUserType().accountTypeId === 2 ||
            getUserType().accountTypeId === 3 ? (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="role"
                    label="Role"
                    type="text"
                    variant="outlined"
                    size="small"
                    className=""
                    fullWidth
                    defaultValue={role || ""}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <div className="d-flex pt-1">
                    <label className="uploadCV-label-length">
                      <p className="CVFileName">
                        {newFileName ? newFileName : fileName}
                      </p>
                      <TextField
                        id="cvAttachment"
                        type="file"
                        variant="outlined"
                        size="small"
                        fullWidth
                        style={{ display: "none" }}
                        onChange={uploadImage}
                      />
                    </label>
                    <div className="CVattachmentIconBorder">
                      <label for="cvAttachment">
                        <Icon
                          path={mdiPaperclip}
                          title="attachment"
                          size={0.1}
                          horizontal
                          vertical
                          rotate={180}
                          color="#707070"
                          className="CVattachmentIcon"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ``
            )}

            <div className="row">
              {recruiterRole() ? (
                <div
                  className="col-md-6 mb-4"
                  data-tip="Please provide the link to your Calendly calendar or other apps to schedule interviews when required."
                >
                  <TextField
                    id="availability_link"
                    label="Schedule App Link"
                    type="text"
                    variant="outlined"
                    size="small"
                    className=""
                    fullWidth
                    defaultValue={availability_link}
                    onChange={(e) => setAvailability_link(e.target.value)}
                  />
                </div>
              ) : (
                <div className="col-md-6 mb-4">
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    size="small"
                    className=""
                    fullWidth
                    defaultValue={userProfile?.email}
                    disabled
                  />
                </div>
              )}

              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <TextField
                      id="country-code"
                      label="Code"
                      required
                      asterisk
                      variant="outlined"
                      select
                      size="small"
                      className=""
                      fullWidth
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value.code);
                        setSearchCodeText("");
                        setCoCode(e.target.value.id);
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: 330,
                              anchorPosition: { top: 0, left: 400 },
                            },
                          },
                        },
                        renderValue: () =>
                          coCode ? (
                            <>
                              {" "}
                              <img
                                width={20}
                                src={
                                  countries?.find((x) => x.id === coCode)?.image
                                }
                                alt="fag"
                              />{" "}
                              {countries?.find((x) => x.id === coCode)?.name}
                            </>
                          ) : (
                            <>
                              {" "}
                              <img
                                width={20}
                                src={
                                  countries?.find((x) => x.code === countryCode)
                                    ?.image
                                }
                                alt="fag"
                              />{" "}
                              {
                                countries?.find((x) => x.code === countryCode)
                                  ?.name
                              }
                            </>
                          ),
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
                          onChange={(e) => setSearchCodeText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key !== "Escape") {
                              // Prevents autoselecting item while typing (default Select behaviour)
                              e.stopPropagation();
                            }
                          }}
                        />
                      </ListSubheader>
                      {countries?.length === 0 && <MenuItem>None</MenuItem>}
                      {countries
                        ?.filter((x) => containsText(x.name, searchCodeText))
                        ?.map((count) => {
                          return (
                            <MenuItem
                              key={count.id}
                              value={{ code: count.code, id: count.id }}
                            >
                              <img width={20} src={count.image} /> {count.name}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </div>
                  <div className="col-md-8 mb-4">
                    <TextField
                      id="phone"
                      label="Phone number"
                      required
                      asterisk
                      type="number"
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      defaultValue={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {countryCode}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <TextField
                  id="streetAddress1"
                  label="Street Address 1"
                  type="text"
                  variant="outlined"
                  size="small"
                  className=""
                  fullWidth
                  defaultValue={street_1}
                  onChange={(e) => setStreet_1(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-4">
                <TextField
                  id="streetAddress2"
                  label="Street Address 2"
                  type="text"
                  variant="outlined"
                  size="small"
                  className=""
                  fullWidth
                  defaultValue={street_2}
                  onChange={(e) => setStreet_2(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <TextField
                  id="country"
                  label="Country"
                  required
                  asterisk
                  variant="outlined"
                  select
                  size="small"
                  className=""
                  fullWidth
                  value={country}
                  MenuProps={{ autoFocus: false }}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setSearchText("");
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
                    renderValue: () => (
                      <>
                        {" "}
                        <img
                          width={20}
                          src={countries?.find((x) => x.id === country)?.image}
                        />{" "}
                        {countries?.find((x) => x.id === country)?.name}
                      </>
                    ),
                  }}
                >
                  <ListSubheader>
                    <TextField
                      size="small"
                      // Autofocus on textfield
                      labelId="country-select-label"
                      id="country-select"
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
                  {countries?.length === 0 && <MenuItem>None</MenuItem>}
                  {countries
                    ?.filter((x) => containsText(x.name, searchText))
                    ?.map((count) => {
                      return (
                        <MenuItem key={count.id} value={count.id}>
                          <img width={20} src={count.image} /> {count.name}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </div>

              <div className="col-md-6 mb-4">
                <TextField
                  id="region"
                  required
                  label="Region/State/Province"
                  type="text"
                  variant="outlined"
                  size="small"
                  className=""
                  fullWidth
                  defaultValue={region_state_province}
                  onChange={(e) => setRegion_state_province(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <TextField
                  id="city"
                  label="City"
                  required
                  asterisk
                  type="text"
                  variant="outlined"
                  size="small"
                  className=""
                  fullWidth
                  defaultValue={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-4">
                <TextField
                  id="website"
                  label="Website"
                  type="text"
                  variant="outlined"
                  size="small"
                  placeholder="e.g my-website.com"
                  className=""
                  autocomplete="false"
                  name="hidden"
                  ref={websiteRef}
                  fullWidth
                  defaultValue={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            {/* PAYMENT LEVEL IMPLEMENTATION */}

            {getUserType().accountTypeId === 2 && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="linkedIn"
                    label="LinkedIn URL"
                    type="text"
                    placeholder="e.g linkedin.com/in/account-name"
                    variant="outlined"
                    size="small"
                    className=""
                    fullWidth
                    ref={linkedinRef}
                    defaultValue={linkedIn || ""}
                    onChange={(e) => setLinkedIn(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <TextField
                    id="github"
                    label="Github URL"
                    type="text"
                    placeholder="e.g. github.com/account-name"
                    variant="outlined"
                    size="small"
                    className=""
                    fullWidth
                    ref={githubRef}
                    defaultValue={github || ""}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>
              </div>
            )}
            {freelance === "freelancers" &&
            getUserType().accountTypeId === 3 ? (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="linkedIn"
                    label="Payment Level"
                    select
                    variant="outlined"
                    size="small"
                    className=""
                    fullWidth
                    value={selpaymentLevel || ""}
                    onChange={handleChange}
                  >
                    {paymentLevel.map((paylevel, index) => {
                      return (
                        <MenuItem key={paylevel.id} value={paylevel.id}>
                          {/* {paylevel.name +
                            " " +
                            formatPaymentLevel(`${paylevel.amount}`)} */}
                          {paylevel.name}{" "}[{paylevel.amount}]
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </div>

                <div className="col-md-6 mb-4">
                  <TextField
                    id="paymentvalue"
                    label="Payment Value"
                    type="number"
                    className=""
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={paymentValue || ""}
                    onChange={handlePaymentValue}
                  />
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="d-flex justify-content-center">
              {waiting ? (
                <Button
                  variant="contained"
                  className="saveProfileChangesBtn"
                  style={{ color: "white", background: "#2E405B" }}
                >
                  {fileLoading && (
                    <div style={{ marginRight: "5px" }}>
                      <ClipLoader size={15} color="#1b98e0" loading />
                    </div>
                  )}
                  Uploading file
                </Button>
              ) : (
                <Button
                  className="saveProfileChangesBtn"
                  variant="contained"
                  fullWidth
                  type="submit"
                  style={{ color: "white", background: "#2E405B" }}
                >
                  Save Profile Details
                </Button>
              )}
            </div>
          </CardContent>
          <ReactTooltip place="bottom" backgroundColor="#2E405B" />
        </Card>
      </form>
    </div>
  );
}

export default Profile;
