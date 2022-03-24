

import React, { useState } from "react";
import { Button, DialogContent, Dialog, Snackbar } from "@material-ui/core";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import { useDispatch } from "react-redux";

const DeleteCard = ({ deleteId, closeDeleteDia, del }) => {
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeDialog = () => {
    closeDeleteDia();
  };

  const shoeSnack = () => {
    setOpen(true);
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

  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const dispatch = useDispatch();

  const deleteSkill = async () => {
    const data = {
      newId: null,
      newSubCategoryId :null
    };

    setloading(true);

    Api()
      .post(`/admin/categories/delete/${deleteId || del?.id}`,data)     
       .then((response) => {
        shoeSnack();
          setAlert({
            open: true,
            message: `${response.data.message}`,
            severity: "success",
          });
        
        closeAlert();
        setloading(false);
        setTimeout(() => {
          closeDialog();
        }, 3000);

        window.location.assign("/platform-category");
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: `${error.message}`,
          severity: "error",
        });
        closeAlert();
        setloading(false);
      });
  };

  return (
    <div>
      <DialogContent className="text-center">
        <p>Are you sure you want to delete these records?</p>

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
              type="submit"
              onClick={deleteSkill}
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
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClosed}
      >
        <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default DeleteCard;

