import {
  Button,
  InputAdornment,
  Card,
  TextField,
  Dialog,
} from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import { useEffect, useState } from "react";
import Api from "../../Services/api";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import AddonCard from "./AddonCard";
import AddEditCard from "./AddEditCard";
import { ClipLoader } from "react-spinners";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "rgb(232, 241, 250)",
  },
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

const Filters = () => {
  const classes1 = usePageStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [pageLength, setpageLength] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const [catMessage, setCatMessage] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);

  const [isReady, setIsReady] = useState(false);
  const [editmode, setEditmode] = useState(false);
  const [search, setSearched] = useState("");

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);

    await getaddOns(value);
  };

  const handleFilter = () => {
    getaddOns();
  };

  const handleSearch = (e) => {
    if (e.key == "Enter") {
      getaddOns();
    }
  };

  const getaddOns = async (pageNumber = 1) => {
    const data = {
      keyword: search == "" ? null : search,
    };
    Api()
      .post(`admin/add-ons/all/${pageNumber}`, data)

      .then((response) => {
        setIsReady(true);
        setAddOn(response?.data?.result?.data);
        setCatMessage(response.data);
        setpageLength(response?.data?.result?.pages);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getaddOns();
  }, []);

  return (
    <div>
      <div className="row justify-content-between mt-4">
        <div className="col-md-4 mb-3">
          <TextField
            id="search"
            label="Search by keyword"
            type="search"
            variant="outlined"
            className=" allJobsSearchPlaceholder"
            size="small"
            fullWidth
            onChange={(e) => setSearched(e.target.value)}
            onKeyUp={handleSearch}
            value={search}
            style={{
              backgroundColor: "white",
            }}
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
            Add Project Tool
          </Button>
        </div>
      </div>

      {/* 
ADD DIALOG */}
      <Dialog
        open={openDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
        className="dialogborder"
      >
        <AddEditCard editmode={editmode} handleClose={handleClose} />
      </Dialog>

      <div className="row mt-4 mr-5 mb-3">
        {!isReady && (
          <div className="d-flex justify-content-center align-item-center mt-5">
            <ClipLoader size={40} color="#1b98e0" loading />
          </div>
        )}
        {addOn && addOn.map((add) => <AddonCard add={add} key={add.id}/>)}
      </div>

      {catMessage.message === "Empty" ? (
        <Card
          className="mt-1"
          style={{
            borderRadius: "3px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            cursor: "pointer",
            padding: "35px",
          }}
        >
          <div className="row text-center mt-5 mb-5">
            <div className="col-md-12">
              <img src="/images/Group 2456.png" alt="no job posted" />
              <p className="mt-5">No Project tool added.</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="d-flex justify-content-center mt-4 mb-4">
          <Pagination
            count={pageLength?.length}
            variant="outlined"
            page={pageNumber}
            onChange={handlePageChange}
            classes={{ ul: classes1.ul }}
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default Filters;
