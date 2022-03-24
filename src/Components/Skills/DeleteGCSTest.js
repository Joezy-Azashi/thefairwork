import React, { useState } from "react";
import { Button, DialogContent } from "@material-ui/core";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { getSkillIndustryType } from "../../Services/redux/skills/index";
import { skillsReducer } from "../../Services/redux/skills/skills_slice";
import { getCurrentUser } from "../../Services/auth";

export default function DeleteGCATest({ deleteId, closeGCADelete, userAccountId }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
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

  const closeDialog = () => {
    closeGCADelete();
  };

  const getIndustryType = async () => {
    await dispatch(getSkillIndustryType(userAccountId))
      .then((response) => {
      })
      .catch((error) => {});
  };

  const DeleteGCATest = async () => {
    setloading(true);
    Api()
      .delete(`/admin/delete-gca/${deleteId}`)
      .then((response) => {
        setloading(false);
        setTimeout(async () => {
            await getIndustryType();
            closeDialog();
          }, 300);
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
  };

  return (
    <div>
      <div>
        <DialogContent className="text-center">
          <p>Are you sure you want to delete this record?</p>

          <div className="row justify-content-center text-center">
            <div className="col-md-6 mb-2" align="right">
              <Button
                className="btn w-100"
                variant="outlined"
                onClick={closeDialog}
              >
                No
              </Button>
            </div>
            <div className="col-md-6" align="left">
              <Button
                variant="outlined"
                className="w-100"
                onClick={() => {
                  DeleteGCATest();
                }}
                type="submit"
              >
                {loading && (
                  <div style={{ marginRight: "5px" }}>
                    <ClipLoader size={20} color="#1b98e0" loading />
                  </div>
                )}
                Yes
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </div>
  );
}
