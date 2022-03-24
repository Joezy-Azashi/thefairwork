import React, { useState } from "react";
import {Button, DialogContent, Snackbar} from '@material-ui/core';
import Api from "../../Services/api";
import { Alert } from '@material-ui/lab';
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import {getUserPortfolio} from "../../Services/redux/portfolio/index"

export default function DeletePortfolio({ deleteId, closeDeleteDia, userAccount }) {
  const dispatch = useDispatch();
  const [openPageLoader, setOpenPageLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeAlert = () => {
    setTimeout(() => {
        setAlert({
            open: false,
            message: '',
            severity: ''
        })
    }, 4000)
  }

  const handleClose = () => {
    setOpenPageLoader(false);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  const closeDialog = () => {
    closeDeleteDia();
  };

  const getCertificate = async () => {
    await dispatch(getUserPortfolio(userAccount));
  };

  const DeletePortfolio = async () => {
    setloading(true)
      Api().delete(`/users/delete-user-portfolio/${deleteId}`)
      .then((response) => {
        setloading(false)
        setTimeout(async () => {
          await getCertificate();
          closeDialog();
        }, 300);
      }).catch((error) => {
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
        setOpen(true)
        closeAlert()
      })
  }


  return (
    <div>
      <div>
        <DialogContent className="text-center">
          <p>Are you sure you want to delete this record?</p>

          <div className="row justify-content-center text-center">
            <div className="col-md-6 mb-2" align="right">
              <Button className="btn w-100" variant="outlined" onClick={closeDialog}>
                No
              </Button>
            </div>
            <div className="col-md-6" align="left">
              <Button
                variant="outlined"
                className="w-100"
                onClick={() => {
                    DeletePortfolio(deleteId);
                }}
                type="submit"
              >
                   {
                  loading && <div style={{marginRight : '5px'}}><ClipLoader size={20} color="#1b98e0" loading /></div> 
                }
                Yes
              </Button>
            </div>
          </div>
        </DialogContent>

          <Snackbar
            open={open}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={4000}
            onClose={closeSnackbar}
          >
            <Alert severity={alert.severity}>{alert.message}</Alert>
          </Snackbar>
      </div>
    </div>
  );
}