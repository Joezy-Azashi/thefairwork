import React, { useEffect, useState } from "react";
import { Button, DialogContent} from "@material-ui/core";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import {useDispatch} from 'react-redux'
import {adminDeleteUser} from "../../Services/redux/admin/index"
import {adminReducer} from "../../Services/redux/admin/admin_slice"

function DeleteUser({ userAccountId, closeDeleteDia, apiUrl }) {
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();

  const deleteUser = async () => {
    await dispatch(adminDeleteUser(userAccountId))
    .then(async(response) => {
        closeDeleteDia()
        window.location.assign(apiUrl)
    }).catch((error) => {

    })

  }

  return (
    <div>
      <DialogContent className="text-center">
          <p>Are you sure you want to delete this record?</p>
        <div className="row justify-content-center text-center">
          <div className="col-md-6 mb-2" align="right">
            <Button variant="outlined" className="btn w-100" onClick={closeDeleteDia}>
              No
            </Button>
          </div>
          <div className="col-md-6" align="left">
            <Button
              variant="outlined"
              className="w-100"
              type="submit"
              onClick={deleteUser}
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

export default DeleteUser;
