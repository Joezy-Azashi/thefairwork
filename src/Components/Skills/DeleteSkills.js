import React, { useState } from "react";
import {Button, DialogContent} from '@material-ui/core';
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";

export default function DeleteSkills({ deleteId, closeDeleteDia, userIndustryType }) {
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


  const closeDialog = () => {
    closeDeleteDia();
  };

  const DeleteSkills1 = async () => {
    const data ={
      type: userIndustryType
    }
    setloading(true)
      Api().post(`/users/delete-user-skill/${deleteId}`, data)
      .then((response) => {
        setloading(false)
        closeDialog()
          window.location.reload()
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
                  DeleteSkills1();
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
      </div>
    </div>
  );
}