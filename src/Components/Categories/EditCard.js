import { Button, DialogContent, TextField, Snackbar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { Alert } from "@material-ui/lab";
import Api from "../../Services/api";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

const EditCard = ({ userData, closeEditDia, selectedVal }) => {
  const profileData = userData || selectedVal;
  const [editCategory, setEditCategory] = useState(
    userData?.category || selectedVal?.category
  );

  const [link, setLink] = useState(selectedVal?.link || userData?.link);

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
      category: editCategory === profileData?.category ? null : editCategory,
      categoryLink: link ? link : null,
    };

    Api()
      .put(`admin/categories/update/${profileData?.id}`, data)
      .then(async (response) => {
        shoeSnack();
        if (response.status === 201) {
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

        window.location.assign("/platform-category");
      })
      .catch((error) => {
        shoeSnack();
        setAlert({
          open: true,
          message: `${error.message}`,
          severity: "error",
        });
      });
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

            <div
              className="col-md-12 pageTitle"
              style={{ marginBottom: "35px" }}
            >
              <h6>
                <b>
                  {profileData?.parentId !== null
                    ? "Edit SubCategory"
                    : "Edit Category"}
                </b>
              </h6>
            </div>

            <div className="col-md-12 mb-4">
              {profileData?.parentId === null ? (
                <TextField
                  id="question"
                  type="text"
                  variant="outlined"
                  label="Category"
                  className="cpFilterLabel"
                  value={editCategory}
                  size="small"
                  onChange={(e) => setEditCategory(e.target.value)}
                  style={{ width: "300px", textTransform: "capitalize" }}
                />
              ) : (
                ""
              )}
            </div>

            <div className="col-md-12 mb-4">
              {profileData?.parentId === null ? (
                <TextField
                  id="question2"
                  type="text"
                  variant="outlined"
                  label="Category link"
                  className="cpFilterLabel"
                  value={link}
                  size="small"
                  onChange={(e) => setLink(e.target.value)}
                  style={{ width: "300px" }}
                />
              ) : (
                ""
              )}
            </div>

            {/* Sub category */}
            {profileData?.parentId !== null ? (
              <div className="col-md-12 mb-4">
                <TextField
                  id="sub"
                  label="Subcategory"
                  className="cpFilterLabel"
                  type="text"
                  variant="outlined"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  size="small"
                  style={{ width: "300px", textTransform: "capitalize" }}
                />
              </div>
            ) : (
              ""
            )}

            {profileData?.parentId !== null ? (
              <div className="col-md-12 mb-4">
                <TextField
                  id="sub2"
                  label="Subcategory link"
                  className="cpFilterLabel"
                  type="text"
                  variant="outlined"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  size="small"
                  style={{ width: "300px" }}
                />
              </div>
            ) : (
              ""
            )}

            <div className="col-md-12" align="center">
              <Button
                variant="contained"
                className="btn"
                type="submit"
                style={{ marginLeft: "10px" }}
                onClick={handleEdit}
              >
                {profileData?.parentId !== null
                  ? "Save Sub Category"
                  : "Save Category"}
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
