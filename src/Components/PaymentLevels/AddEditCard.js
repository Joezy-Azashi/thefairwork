import { Button, DialogContent, TextField, Snackbar, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Alert } from "@material-ui/lab";
import Api from "../../Services/api";
import Icon from "@mdi/react";
import { ClipLoader } from "react-spinners";
import { mdiClose } from "@mdi/js";

const AddEditCard = ({ editmode, editField, handleClosed }) => {
  const [editId, setEditId] = useState(editmode ? editField.id : "");

  const [subcategorytest, setSubCategoryTest] = useState(
    editmode ? editField.amount : ""
  );
const [paymentName,setPaymentName] = useState(editmode ? editField.name : "")
// const [limit, setLimit] = useState();
const [summary,setSummary]=useState();
const [paymentDescription,setPaymentDescription]=useState(editmode ? editField.description : "")
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeDialog = () => {
    handleClosed();
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

  const handlePaymentDescription = (e) => {
    setPaymentDescription(e.target.value)
    // setLimit(false)
  }

  const addOrUpdate = async () => {
    if (subcategorytest.trim() === "" || paymentName.trim() === "") {
      shoeSnack();
      setAlert({
        open: true,
        message: `Payment Level and Name cannot be empty`,
        severity: "error",
      });
      return;
    }
    if (editmode) {
      handleEdit();
    } else {
      addNewCategory();
    }
  };

  const inputHandler = (e) => {
    const payLevel = e.target.value.replace(/[^0-9 \-.]/g, "");
    setSubCategoryTest(payLevel);
  };

  const addNewCategory = async () => {


    const data = {
      name:paymentName,
      amount: subcategorytest,
      description:paymentDescription
    };

    Api()
      .post(`admin/payment-levels`, data)
      .then(async (response) => {
        shoeSnack();

        setAlert({
          open: true,
          message: `${response.data.message}`,
          severity: "success",
        });
        closeAlert();
        setTimeout(() => {
          closeDialog();
        }, 1000);

        window.location.assign("/paymentlevels");
      })
      .catch((error) => {
        shoeSnack();
        setAlert({
          open: true,
          message: `${error.message}`,
          severity: "error",
        });
      });

    setSubCategoryTest("");
  };
  
  
  const handleEdit = async () => {
    const data = {
      name:paymentName,
      amount: subcategorytest,
      description:paymentDescription
    };

    Api()
      .put(`admin/payment-levels/${editId}`, data)
      .then(async (response) => {
        shoeSnack();

        setAlert({
          open: true,
          message: `${response.data.message}`,
          severity: "success",
        });

        closeAlert();
        setTimeout(() => {
          closeDialog();
        }, 3000);

        window.location.assign("/paymentlevels");
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
      <DialogContent className="text-center">
        <Icon
          path={mdiClose}
          size={1}
          horizontal
          vertical
          onClick={handleClosed}
          className="close"
          rotate={180}
          style={{ float: "right" }}
        />
        <div style={{ padding: "60px" }}>
          <div className="row mb-3">
            <div className="col-md-12">
              <h6>
                <b>{editmode ? "Edit Payment Level" : "Add Payment Level"} </b>
              </h6>
            </div>
          </div>

          {/* DROPDOWN */}

          <div className="row" style={{textAlign: "left"}}>
            <div className="col-md-6 ">
              <TextField
                id="catlabel"
                label="Payment Level"
                select
                required
                asterisk
                className=""
                variant="outlined"
                style={{ marginBottom: "35px" }}
                size="small"
                fullWidth
                value={paymentName || ""}
                onChange={(e)=>setPaymentName(e.target.value)}
              >
                {/* <MenuItem value="paymentLevel" key="paymentLevel">Select Payment Level</MenuItem> */}
                <MenuItem value="Rhodium" key="Rhodium">Rhodium</MenuItem>
                <MenuItem value="Platinum" key="Platinum">Platinum</MenuItem>
                <MenuItem value="Gold" key="Gold">Gold</MenuItem>

              </TextField>
            </div>

            <div className="col-md-6 ">
              <TextField
                id="catlabel"
                label="Level Amount"
                type="text"
                required
                asterisk
                className=""
                variant="outlined"
                style={{ marginBottom: "35px" }}
                size="small"
                fullWidth
                value={subcategorytest}
                onChange={inputHandler}
              />
            </div>

          </div>


         
            


          <div className="row">
            <div className="col-md-12 ">
              <TextField
                id="catlabel"
                multiline
                rows={4}
                label="Description"
                type="text"
                className=""
                variant="outlined"
                style={{ marginBottom: "35px" }}
                size="small"
                fullWidth
                // helperText={
                //   limit ? (
                //     <div className="mb-2 ">
                //       <p className="error-text">
                //         120 characters minimum or up to 1000 characters
                //       </p>
                //     </div>
                //   ) : summary?.length > 0 ? (
                //     <div className=" ">
                //       {summary?.length > 0 && summary?.length < 1000 ? (
                //         <p style={{ color: "#2E405B" }}>
                //           {summary.length}{" "}
                //           <span>
                //             {" "}
                //             characters (minimum of 120 characters)
                //           </span>
                //         </p>
                //       ) : (
                //         <div className="">
                //           <p className="error-text">
                //             120 characters minimum or up to 1000 characters
                //           </p>
                //         </div>
                //       )}
                //     </div>
                //   ) : (
                //     ``
                //   )
                // }
                value={paymentDescription}
                onChange={handlePaymentDescription}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <Button
                variant="contained"
                className="btn"
                type="submit"
                onClick={addOrUpdate}
                style={{ width: "150px" }}
              >
                {loading && (
                  <div>
                    <ClipLoader size={15} color="#1b98e0" loading />
                  </div>
                )}
                {loading ? "" : "Save Level"}
              </Button>
            </div>
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
        onClose={handleClose}
      >
        <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
};
export default AddEditCard;
