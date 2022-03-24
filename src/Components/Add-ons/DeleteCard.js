import { ClipLoader } from "react-spinners";
import { DialogContent, Button } from "@material-ui/core";
import Api from "../../Services/api";
import { useState } from "react";

const DeleteCard = ({ addOnId, closeDeleteDia }) => {
  const [loading, setloading] = useState(false);

  const closeDialog = () => {
    closeDeleteDia();
  };

  const handleDelete = () => {
    setloading(true);

    Api()
      .delete(`admin/add-ons/delete/${addOnId}`)
      .then((response) => {
        setloading(false);
        closeDialog();
        window.location.assign("/project-tools");
      })
      .catch((error) => {
        setloading(false);
      });
  };

  return (
    <div>
      <DialogContent className="text-center">
        <p>Are you sure you want to delete this project tool?</p>

        <div className="row justify-content-center text-center">
          <div className="col-md-6 mb-2" align="right">
            <Button
              className="btn w-100"
              variant="outlined"
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
              onClick={handleDelete}
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
};

export default DeleteCard;
