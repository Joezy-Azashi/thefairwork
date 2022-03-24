import { Button, DialogContent, TextField, Snackbar } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Alert } from "@material-ui/lab";
import Api from "../../Services/api";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
const EditCard = ({ userData, closeEditDia, selectedVal }) => {
  const profileData = userData || selectedVal;
  const [editCategory, setEditCategory] = useState(
    userData?.name || selectedVal?.name
  );
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeDialog = () => {
    closeEditDia();
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleEdit = async () => {
    const data = {
      name: editCategory,
    };
    const errorMessage = profileData?.parentId !== null
                  ? "Category name is required"
                  : "Industry name is required"
    if(data?.name.trim().length === 0){
      shoeSnack();
      setAlert({
        open: true,
        message: errorMessage,
        severity: "error"
      })
      
    }
    else{

      Api()
        .put(`admin/industries/update/${profileData?.id}`, data)
        .then((response) => {
          shoeSnack();
          if (response.status === 201 || 200) {
            setAlert({
              open: true,
              message: `${response.data.message}`,
              severity: "success",
            });
          }
          closeAlert();
          setTimeout(() => {
            closeDialog();
          }, 3000);
  
          window.location.assign("/local-category");
        })
        .catch((error) => {
          shoeSnack();
          setAlert({
            open: true,
            message: `${error.message}`,
            severity: "error",
          });
        });
    }

  };

  return (
    <div>
      <div className="col-md-12 pageTitle">
        <div>
          <DialogContent className="text-center">
            <Icon
              path={mdiClose}
              size={1}
              horizontal
              vertical
              onClick={closeDialog}
              className="close"
              rotate={180}
              style={{ float: "right" }}
            />

            <div className="col-md-12 mt-4 pageTitle">
              <h6>
                <b>
                  {profileData?.parentId !== null
                    ? "Edit Category"
                    : "Edit Industry"}
                </b>
              </h6>
            </div>
            <br />

            {/* DROPDOWN */}

            {/* HIDDEN TEXTFIELD */}
            <div className="col-md-12 mb-4">
              {profileData?.parentId === null ? (
                <TextField
                  id="question"
                  required
                  asterisk
                  type="text"
                  variant="outlined"
                  label="Industry"
                  className=""
                  value={editCategory}
                  size="small"
                  onChange={(e) => setEditCategory(e.target.value)}
                  style={{ width: "300px" }}
                />
              ) : (
                ""
              )}
            </div>
            <br />

            {/* Sub category */}
            {profileData?.parentId !== null ? (
              <div className="col-md-12 mb-4">
                <TextField
                  required
                  asterisk
                  id="sub"
                  label="Category"
                  className="cpFilterLabel"
                  type="text"
                  variant="outlined"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  size="small"
                  style={{ width: "300px" }}
                />
              </div>
            ) : (
              ""
            )}
            <br />

            <div className="col-md-12" align="center">
              <Button
                variant="contained"
                className="btn"
                type="submit"
                style={{ marginLeft: "10px" }}
                onClick={handleEdit}
              >
                {profileData?.parentId !== null
                  ? "Save Category"
                  : "Save Industry"}
              </Button>
            </div>
            <br />
          </DialogContent>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
};
export default EditCard;
