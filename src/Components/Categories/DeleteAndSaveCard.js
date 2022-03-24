import React, { useState } from "react";
import { Button, DialogContent, Dialog, Snackbar } from "@material-ui/core";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import Icon from "@mdi/react";
import { mdiClose  } from "@mdi/js";

const DeleteAndSaveCard = ({ deleteId, closeDeleteAndSave,changeData, del }) => {
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
 

  const closeDialog = () => {
    closeDeleteAndSave();
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

  const deleteAndSave=()=>{
    const data = {
        newId: null,
        newSubCategoryId: null
      };
  
      setloading(true);
  
      Api()
        .post(`/admin/categories/delete/${deleteId}`, data)
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

  }

  return (
    <div>
      <DialogContent >
        <div style={{textAlign:"right", marginBottom:"12px"}}>
        <Icon
            path={mdiClose}
            size={1}
            horizontal
            vertical
            onClick={closeDeleteAndSave}
            className="close"
            rotate={180}
            style={{ marginBottom: "6px"}}
          />
        </div>
        <p className="mb-4" style ={{padding:"0 2rem", textAlign:"center", fontSize:"14px"}}>
          Are you sure you want to delete this Category? This will delete all
          sub-categories, freelancer skills, and jobs linked to this category.
        </p>

        <div className="row justify-content-center text-center mb-4">
          <div className="col-md-6 mb-2" align="right">
            <Button
              variant="outlined"
              className=" w-100"
              type = "submit"
              onClick={deleteAndSave}
            >
              <span style={{whiteSpace:"noWrap",margin:"0 0.1px",padding:"3 0", fontSize:"12px"}}>Delete Everything</span>
            </Button>
          </div>
          <div className="col-md-6 " align="left">
            <Button
              variant="outlined"
              className="btn w-100"
              type="submit"
              onClick={()=>{changeData(deleteId); closeDialog();}}
            >
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={20} color="#1b98e0" loading />
                </div>
              )}
              <span style={{whiteSpace:"noWrap",margin:"0 0.1px", fontSize:"12px"}}>Delete & Add New Category</span>
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

export default DeleteAndSaveCard;