import { Card, CardContent, Dialog } from "@material-ui/core";
import { mdiDeleteOutline, mdiSquareEditOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import AddEditCard from "./AddEditCard";
import DeleteCard from "./DeleteCard";
import {currency} from "../../Services/currency"

const AddonCard = ({ add }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [addOnId, setaddOnId] = useState(0);
  const [editField, setEditField] = useState({});

  const [editmode, setEditmode] = useState(false);
  const openDeleteDia = (id) => {
    setOpenDeleteDialog(true);
    setaddOnId(id);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  const handleEdit = (id) => {
    setOpenEditDialog(true);
    setEditmode(true);
    setEditField(id);
  };

  return (
    <>
      <div className=" col-md-4 mb-4 mr-5 ">
        <Card key={add.id} style={{ color: "#2E405B", borderRadius: "7px" }}>
          <CardContent key={add.id}>
            <div className="row justify-content-between mt-1">
              <div className="col mb-3 ">
                <b
                  style={{ color: "#555555", textTransform: "capitalize" }}
                  title={add.title}
                >
                  {add.title.length > 20
                    ? add.title.substring(0, 20) + "..."
                    : add.title}
                </b>

                <div className="d-flex " style={{ float: "right" }}>
                  <div style={{ marginRight: "5px" }}>
                    <div className=" bd-highlight ">
                      <Icon
                        path={mdiSquareEditOutline}
                        size={0.7}
                        horizontal
                        vertical
                        title="Edit"
                        onClick={() => handleEdit(add)}
                        color="#2E405B"
                        rotate={180}
                      />
                    </div>
                  </div>

                  <div className=" bd-highlight">
                    <Icon
                      path={mdiDeleteOutline}
                      size={0.7}
                      onClick={() => openDeleteDia(add.id)}
                      horizontal
                      title="Delete"
                      vertical
                      color="red"
                      rotate={180}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p
              className="job-description2"
              title={add.description.length > 190 ? add.description : ``}
            >
              {add.description}
            </p>

            <b> {currency.secondary} {add.value}</b>
          </CardContent>
          <br />
        </Card>
      </div>
      {/* DELETE DIALOG */}
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <DeleteCard addOnId={addOnId} closeDeleteDia={closeDeleteDia} />
      </Dialog>

      {/* 
EDIT DIALOG */}
      <Dialog
        open={openEditDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
        className="dialogborder"
      >
        <AddEditCard
          editmode={editmode}
          editField={editField}
          handleClose={handleClose}
        />
      </Dialog>
    </>
  );
};

export default AddonCard;
