import React, {useState} from 'react'
import { Button, DialogContent} from "@material-ui/core";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";

function DeleteOrder({closeResetDia, orderId, apiUrl}) {

    const [loading, setloading] = useState(false);

    const deleteOrder = async () => {
        Api().delete(`/team/delete-order/${orderId}`)
        .then((response) => {
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
            <Button variant="outlined" className="btn w-100" onClick={closeResetDia}>
              No
            </Button>
          </div>
          <div className="col-md-6" align="left">
            <Button
              variant="outlined"
              className="w-100"
              type="submit"
              onClick={deleteOrder}
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
    )
}

export default DeleteOrder
