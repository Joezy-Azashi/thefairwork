import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Avatar, Dialog } from "@material-ui/core";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import ButtonBase from "@material-ui/core/ButtonBase";
import ProfileImageUpload from "./ProfileImageUpload";
import Api from "../Services/api";
import { getCurrentUser, getUserType } from "../Services/auth";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(19),
    height: theme.spacing(19),
    borderRadius: "50%",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%",
  },
  image: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.4,
      },
      "& $imageTitle": {
        visibility: "visible",
      },
    },

    [theme.breakpoints.down("sm")]: {
      "& $imageBackdrop": {
        opacity: 0.4,
        width: theme.spacing(19),
        height: theme.spacing(19),
        margin: " auto",
      },
      "& $imageTitle": {
        visibility: "visible",
      },
    },

    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: "15px auto",
    borderRadius: "50%",
  },
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: "50%",
    backgroundColor: theme.palette.common.black,
    opacity: 0,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    visibility: "hidden",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
      theme.spacing(1) + 4
    }px`,
    fontSize: "15px",
    marginTop: "10px",
  },
}));

function UploadProfileImage() {
  const classes = useStyles();
  const [id, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser().user.id
  );
  const [profileId, setProfileId] = useState();
  const [userProfilePicture, setUserProfilePicture] = useState([]);
  const [openPicUpload, setOpenPicUpload] = useState(false);

  const handleOpenImgUpload = () => {
    setOpenPicUpload(true);
  };

  const handleClose = () => {
    setOpenPicUpload(false);
  };

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfilePicture(
          response?.data?.user?.UserProfile?.profile_picture
        );
        setProfileId(response?.data?.user?.UserProfile?.id);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <>
      <form
        className={
          getUserType().accountTypeId === 2 || getUserType().accountTypeId === 3
            ? "profile-image-web"
            : "profile-image-web1"
        }
      >
        <ButtonBase
          disableRipple
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          onClick={handleOpenImgUpload}
        >
          <span className={classes.imageSrc} />
          <Avatar
            alt="Profile Image"
            src={userProfilePicture}
            className={classes.large}
          />
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              <label for="profileImage">
                <CameraAltOutlinedIcon />
                <br />
                Upload Image
              </label>
            </Typography>
          </span>
        </ButtonBase>
      </form>
      <Dialog
        open={openPicUpload}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
        className="dialogborder"
      >
        <ProfileImageUpload profileId={profileId} handleClose={handleClose} />
      </Dialog>
    </>
  );
}

export default UploadProfileImage;
