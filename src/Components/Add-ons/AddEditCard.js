import { DialogContent, Button, TextField, Snackbar } from "@mui/material";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { Alert } from "@material-ui/lab";

const AddEditCard = ({ editmode, editField, handleClose }) => {
  const [descriptionField, setDescriptionField] = useState(
    editmode ? editField.description : ""
  );
  const [titleField, settitleField] = useState(editmode ? editField.title : "");
  const [loading, setLoading] = useState(false);
  const [valueField, setValueField] = useState(editmode ? editField.value : "");
  const [editId, setEditId] = useState(editmode ? editField.id : "");

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const shoeSnack = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    handleClose();
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

  const addOrUpdate = async () => {
    if (editmode) {
      editaddOn();
    } else {
      addNewAddOn();
    }
  };

  const addNewAddOn = async (e) => {
    if(titleField === "" || valueField == "") {
      shoeSnack();
        setAlert({
          open: true,
          message: `Title and Amount cannot be empty`,
          severity: "error",
        });
        closeAlert();
    }
    else {

    
    const data = {
      title: titleField,
      description: descriptionField,
      value: valueField,
    };

    Api()
      .post(`admin/add-ons/create`, data)

      .then((response) => {
        closeDialog();

        window.location.assign("/project-tools");
        settitleField("");
        setDescriptionField("");
        setValueField("");
      })
      .catch((error) => {});
    }
  };

  const editaddOn = async () => {
    if(titleField === "" || valueField == "") {
      shoeSnack();
        setAlert({
          open: true,
          message: `Title and Amount cannot be empty`,
          severity: "error",
        });
        closeAlert();
    }
    else {
    const data = {
      title: titleField,
      value: valueField,
      description: descriptionField,
    };

    Api()
      .put(`admin/add-ons/update/${editId}`, data)
      .then(async (response) => {
        closeDialog();
        window.location.assign("/project-tools");
      })
      .catch((error) => {});
    }
  };

  return (
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

        <div className="row mb-3">
          <div className="col-md-12 ">
            <br />
            <h6>
              <b>{editmode ? "Edit Project Tool" : "Add Project Tool"}</b>
            </h6>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <TextField
              label="Project Tool Title"
              required
              asterisk
              variant="outlined"
              size="small"
              className=""
              fullWidth
              value={titleField}
              onChange={(e) => settitleField(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-4">
            <TextField
              label="Amount"
              required
              asterisk
              variant="outlined"
              size="small"
              fullWidth
              className=""
              type="number"
              value={valueField}
              onChange={(e) => setValueField(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-4 mt-2">
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={3}
              className=""
              fullWidth
              type="text"
              variant="outlined"
              value={descriptionField}
              onChange={(e) => setDescriptionField(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="row mb-4">
          <div className="col-md-12" align="center">
            <Button
              variant="contained"
              className="btn"
              id="addon"
              type="submit"
              onClick={addOrUpdate}
            >
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={15} color="#1b98e0" loading />
                </div>
              )}
              {editmode ? "Save Project Tool" : "Save Project Tool"}
            </Button>
          </div>
        </div>

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
      </DialogContent>
  );
};

export default AddEditCard;
