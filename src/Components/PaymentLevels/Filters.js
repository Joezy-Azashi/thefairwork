import {
  Button,
  InputAdornment,
  Dialog,
  Snackbar,
} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@mdi/react";
import { mdiMagnify} from "@mdi/js";
import { useEffect, useState } from "react";
import Api from "../../Services/api";
import PaymentCard from "./PaymentCard";
import { ClipLoader } from "react-spinners";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import AddEditCard from "./AddEditCard";

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

const Filters = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [pageLength, setpageLength] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catMessage, setCatMessage] = useState([]);

  const [editmode, setEditmode] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [search, setSearched] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleFilter = () => {
    getCategoriesData();
  };



  const getCategoriesData = async () => {
    Api()
      .post("admin/all-payment-levels", {
        keyword:search,
      })

      .then((response) => {
        setIsReady(true);
        setCategories(response?.data);
        setCatMessage(response?.data);
      })
      .catch((error) => {});
  };

  const handleSearch = (e) => {
    if (e.key == "Enter") {
      getCategoriesData();
    }
  };

  useEffect(() => {
    getCategoriesData();
  }, []);

  return (
    <div>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <TextField
            id="search"
            label="Search payment levels"
            type="search"
            variant="outlined"
            className="allJobsSearchPlaceholder"
            value={search}
            onChange={(e) => setSearched(e.target.value)}
            onKeyUp={handleSearch}
            size="small"
            style={{
              backgroundColor: "white",
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon
                    path={mdiMagnify}
                    size={1}
                    horizontal
                    vertical
                    color="#808080"
                    rotate={180}
                  />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="col-md-3 mb-3">
          <Button
            variant="contained"
            className="btn searchfilterBtn"
            onClick={handleFilter}
          >
            Search
          </Button>
        </div>
        <div className="col-md-5 mb-3" align="right">
          <Button
            variant="contained"
            className="btn searchfilterBtn1"
            startIcon={<AddIcon style={{ fontSize: "30px" }} />}
            onClick={openDeleteDia}
          >
            Add Level
          </Button>
        </div>
      </div>

      {/* ADD CATEGORY DIALOG BOX   */}
      <Dialog
        open={openDeleteDialog}
        fullWidth
        maxWidth="sm"
        fullWidth
        className="dialogborder"
      >
        <AddEditCard editmode={editmode} handleClosed={handleClose} />
      </Dialog>

      <div className="row mt-4">
        {
          !isReady ? (
            <div className="d-flex justify-content-center align-item-center mt-5">
            <ClipLoader size={40} color="#1b98e0" loading />
          </div>
          ) : catMessage.length <= 0 ? (
            <div className="row text-center mt-5 mb-5">
            <div className="col-md-12">
              <img src="/images/Group 2461.png" alt="no payments to be made" />
              <p className="mt-4">
                No payment levels has been added at the moment{" "}
              </p>
            </div>
          </div>
          ) : (
            categories?.map((cat) => <PaymentCard cat={cat} key={cat.id} />)
          )}
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
    </div>
  );
};

export default Filters;
