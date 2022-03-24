import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Button } from "@material-ui/core";
import Api from "../Services/api";
import { getCurrentUser } from "../Services/auth";
import { useHistory } from "react-router-dom";
import { freelancerRole, recruiterRole } from "../Services/userTypes";

function CompleteProfileDialog() {
  const [openProfilePrompt, setOpenProfilePrompt] = useState(false);
  const [profileCheck, setProfileCheck] = useState();
  const [id, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );

  const handleClosePrompt = () => {
    setOpenProfilePrompt(false);
  };

  const handleclick = () => {
    window.location.assign("/profile");
  };

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setProfileCheck(response.data.check);
        if (
          (!response.data.check && freelancerRole()) ||
          (response.data.check !== true && recruiterRole())
        ) {
          setOpenProfilePrompt(true);
        } else {
          setOpenProfilePrompt(false);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <Dialog
      open={openProfilePrompt}
      onClose={handleClosePrompt}
      disableBackdropClick
      fullWidth
      maxWidth="sm"
      className="dialogborder"
    >
      <DialogContent className="p-4 pt-5">
        <div className="text-center mb-4">
          <h6>
            <b>Update Your Profile</b>
          </h6>
        </div>
        <div className="d-flex justify-content-center text-center mb-4">
          {freelancerRole() ? (
            <p>
              Hello freelancer, welcome to TheFairWork! Please add at least
              your name, phone number, summary pitch and one skill to continue
              using this platform
            </p>
          ) : (
            <p>
              {" "}
              Hello client, welcome to TheFairWork! To navigate other pages you will
              have to provide your name,phone number,country,city and company
              details on your profile.
            </p>
          )}
        </div>
        <div className="d-flex justify-content-center mb-2">
          <Button
            variant="contained"
            className="btn"
            style={{ textTransform: "lowercase" }}
            onClick={() => {
              handleclick();
            }}
          >
            Update profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CompleteProfileDialog;
