import React, {useState } from "react";
import { Button, DialogContent } from "@material-ui/core";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { getUserExperience } from "../../Services/redux/experience/index";
import { useDispatch } from "react-redux";

function DeleteExperience({ deleteId, closeDeleteDia, userAccount }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
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
  const [loading, setloading] = useState(false);

  const closeDialog = () => {
    closeDeleteDia();
  };

  const getExperience = async () => {
    await dispatch(getUserExperience(userAccount));
  };

  const DeleteExperience = async () => {
    setloading(true);
    Api()
      .delete(`/users/delete-user-experience/${deleteId}`)
      .then((response) => {
        setloading(false);
        setTimeout(async () => {
          await getExperience();
          closeDialog();
        }, 300);
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
  };

  return (
    <div>
      <DialogContent className="text-center">
        <p>Are you sure you want to delete this record?</p>

        <div className="row justify-content-center text-center">
          <div className="col-md-6 mb-2" align="right">
            <Button
              variant="outlined"
              className="btn w-100"
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
                DeleteExperience(deleteId);
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
  );
}

export default DeleteExperience;
