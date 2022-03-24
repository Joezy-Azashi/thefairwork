import React, { useState, useEffect } from "react";
import { CardContent, Card, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "../../Services/auth";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import Api from "../../Services/api";

function ProfileCompletion() {
  const history = useHistory();

  const [id, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [userProfile, setUserProfile] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const [initialValue, setinitialValue] = useState(true);

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfile(response?.data?.user);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getProfileData();
    ProfileCompletion();
  }, []);

  const ProfileCompletion = () => {
    Api()
      .get(`/users/profile-completion-meter/${id}`)
      .then((response) => {
        setinitialValue(false);
        setPercentage(response?.data?.profileMeterPercentage);
      })
      .catch((error) => {});
  };

  const handleclick = () => {
    history.push("/edit-profile", {
      params: localStorage.setItem("userDetails", JSON.stringify(userProfile)),
    });
  };

  return (
    <Card className="mb-4 cardGradient">
      <CardContent className="">
        <div className="row">
          <div className="col-md-9">
            <h6 className="ProfileCompleteHeader mb-3">
              {percentage === 100 ? (
                <b>Great work done on your profile</b>
              ) : (
                <b>Complete Your Profile</b>
              )}
            </h6>

            <p style={{ fontSize: "12px" }}>
              Your profile is the most important part of your stay on our
              platform. A complete profile gives you
              <br />
              visibility to thousands of potential clients and recruiters from
              across the world.
            </p>

            <Button
              variant="outlined"
              className="editProfileBtn mt-3"
              onClick={() => {
                handleclick();
              }}
            >
              Edit Profile
            </Button>
          </div>
          <div className="col-md-3 meter text-center">
            <div style={{ width: "143px", height: "143px" }}>
              <CircularProgressbarWithChildren value={percentage}>
                <div className="mt-3">
                  <p
                    style={{
                      color: "white",
                      fontSize: "25px",
                      marginBottom: "1px",
                    }}
                  >
                    {initialValue ? `0` : percentage}%
                  </p>
                  <p style={{ fontSize: "10px" }}>Profile Completed</p>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileCompletion;
