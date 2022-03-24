import React, { useEffect } from "react";
import {
  setAuthToken,
  setCurrentUser,
  setSignUpUser,
} from "../../Services/auth";
import Api from "../../Services/api";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const RedirectPage = () => {
  const id = new URLSearchParams(new URL(window.location).search).get("id");
  const token = new URLSearchParams(new URL(window.location).search).get(
    "token"
  );

  useEffect(() => {
    getOauthUser().then((user) => {
      switch (user.accountTypeId) {
        case 2:
          window.location.assign("/freelancer-all-jobs");
          return;
        case 1:
          window.location.assign("/candidate-pool");
          return;
        case 4:
          window.location.assign("/recruiter-all-jobs");
          return;
        case 3:
          window.location.assign("/admin-dashboard");
          return;
        default:
          window.location.assign("/signup-options");
      }
    });
  });

  async function getOauthUser() {
    try {
      const { data } = await Api().get(`/social/get-user/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setSignUpUser(data);
      setCurrentUser({
        user: data,
      });
      setAuthToken(token);
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <p>
      <Box sx={{ display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    </p>
  );
};

export default RedirectPage;
