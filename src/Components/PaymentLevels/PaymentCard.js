import {
  Card,
  CardContent,
  Dialog,
  Menu,
  MenuItem,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MoreVertRoundedIcon from "@material-ui/icons/MoreVertRounded";
import { useState } from "react";
import { currency } from "../../Services/currency";
import { useHistory } from "react-router";
import DeleteCard from "./DeleteCard";
import AddEditCard from "./AddEditCard";
import formatPaymentLevel from "../../Services/paymentLevels";

const useStyles = makeStyles({
  root: {
    minWidth: 270,
    minHeight: 10,
  },

  title: {
    fontSize: 14,
    textAlign: "center",
    color: "#2E405B",
  },
  backgroundColor: "#2E405B",

  dialog: {
    position: "absolute",
    left: 600,
    top: 250,
  },
});

const PaymentCard = ({ cat }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVal, setSelectedVal] = useState();

  const [editField, setEditField] = useState({});

  const [editmode, setEditmode] = useState(false);

  const handleEditandDelete = (event) => {
    setAnchorEl(event.currentTarget);
    setEditField(cat);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleClose();
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const closeEditDia = () => {
    setOpenEditDialog(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClosed = () => {
    setOpenEditDialog(false);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    setEditmode(true);
    handleClose();
  };
  return (
    <>
      <div className="col-md-4">
        <Card
          sx={{ boxShadow: 2 }}
          style={{ color: "#2E405B", marginBottom: "12px" }}
          key={cat.id}
        >
          <CardContent>
            <div>
            <div className="d-flex justify-content">
              <p
                className="category"
                style={{
                  color: "#2E405B",
                  cursor: "default",
                  fontWeight:"bold",
                  textTransform: "capitalize",
                }}
                title={cat?.name?.length > 21 ? cat?.name : ``}
              >
                {cat.name}
              </p>
              <br/>
            
            
              <MoreVertRoundedIcon
                onClick={handleEditandDelete}
            
              />
              </div>
              <p
                className="category"
                style={{
                  color: "#555555",
                  cursor: "default",
                  textTransform: "capitalize",
                }}
                title={cat?.amount?.length > 21 ? cat?.amount : ``}
              >
                {formatPaymentLevel(cat.amount)}
              </p>
              <p
                className="job-description2"
                style={{
                  color: "#555555",
                  cursor: "default",
                  textTransform: "capitalize",
                }}
                title={cat?.description?.length > 21 ? cat?.description : ``}
              >
                {cat.description}
              </p>
            </div>
          </CardContent>
        </Card>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ marginTop: "27px" }}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </div>

      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <DeleteCard deleteId={editField} closeDeleteDia={closeDeleteDia} />
      </Dialog>

      <Dialog
        open={openEditDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
        className="dialogborder"
      >
        <AddEditCard
          handleClosed={handleClosed}
          editmode={editmode}
          editField={editField}
        />
      </Dialog>
    </>
  );
};

export default PaymentCard;
