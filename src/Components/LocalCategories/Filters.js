import {
  Button,
  InputAdornment,
  Dialog,
  DialogContent,
  Snackbar,
  Card,
  CardContent,
  TextField,
  MenuItem
} from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@mdi/react";
import { mdiMagnify, mdiPlusThick } from "@mdi/js";
import { useEffect, useState } from "react";
import Api from "../../Services/api";
import LocalCategoryCard from "./LocalCategoryCard";
import { ClipLoader } from "react-spinners";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import Pagination from "@material-ui/lab/Pagination";
import { mdiClose } from "@mdi/js";

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

const Filters = ({ filtercategory }) => {
  const classes1 = usePageStyles();
  const classes = useStyles();
  const [categoryData, setCategoryData] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLength, setpageLength] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catMessage, setCatMessage] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [skilla, setSkilla] = useState();
  const [categoryForUpdate, setcategoryForUpdate] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [selectCategory, setSelectCategory] = useState("");
  const [hiddenfield, setHiddenField] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isReady2, setIsReady2] = useState(false);
  const [popData, setPopData] = useState();
  const [search, setSearched] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dataToChange, setDataToChange] = useState({});
  const [action, setAction] = useState(null);

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
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

  const handlePageChange = async (event, value) => {
    setpageNumber(value);

    await getCategoriesData(value);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClick = (e) => {
    if (e.target.value === "createcategory") {
      setSelectCategory(e.target.value);
      setExpanded(false);
    } else {
      setSelectCategory(e.target.value);
      const result = skilla.find(({ id }) => id === e.target.value);
      setcategoryForUpdate(result?.Industries);
      setExpanded(true);
    }
  };

  const changeData = (oldCategory) => {
    setDataToChange(oldCategory);
    setAction("delete");
    openDeleteDia();

  };

  const addNewCategory = async (e) => {
    //accept name, subcategory
    if (selectCategory === "createcategory") {
      const data = {
        name: hiddenfield.toLowerCase(),
      };

      if (!["", null].includes(subcategory)) {
        data.category = { name: subcategory.toLowerCase() };
      }
      if(data?.name.trim().length === 0){
        shoeSnack();
        setAlert({
          open: true,
          message: "Industry name is required",
          severity: "error"
        })
        openDeleteDia();
      }
      else{

        Api()
          .post(`admin/industries/create`, data)
  
          .then(async (response) => {
            shoeSnack();
            if (response.status === 201 || 200) {
              setAlert({
                open: true,
                message: `${response.data.message}`,
                severity: "success",
              });
              closeAlert();
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            } else {
              shoeSnack();
              if (response.status === 208) {
                setAlert({
                  open: true,
                  message: `${response.data.message}`,
                  severity: "error",
                });
                closeAlert();
              }
            }
  
            await getCategoriesData(pageNumber);
            await getCategoriesData2();
          })
          .catch((error) => {});
      }

    } else {
      const data = {
        category: { name: subcategory.toLocaleLowerCase().trim() },
      };
      if(data.category.name.length === 0 || selectCategory === ''){
        shoeSnack();
        setAlert({
          open: true,
          message: "All Fields Are Required",
          severity: "error"
        })
        openDeleteDia();
      } else{

        Api()
          .put(`admin/industries/update/${selectCategory}`, data)
          .then(async (response) => {
            handleClose();
            shoeSnack();
            setAlert({
              open: true,
              message: `${response.data.message}`,
              severity: "success",
            });
  
            closeAlert();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
  
            //await getCategoriesData(pageNumber);
          })
          .catch((error) => {
            shoeSnack();
  
            setAlert({
              open: true,
              message: `${error.message}`,
              severity: "error",
            });
  
            closeAlert();
          });
          handleClose();
          setSubCategory("");
          setHiddenField("");
          setExpanded(true);
          setSelectCategory("");
      
          getCategoriesData2();
      }
      }
      

  };

  const handleFilter = () => {
    getCategoriesData();
  };

  const deleteAndSaveCategory = async () => {
    const data = {
      newId: selectCategory,
      newCategoryId: subcategory ? subcategory : null,
      dataToChange : dataToChange
    };


    Api()
      .post(`/admin/industries/delete/${dataToChange}`, data)
      .then((response) => {
        shoeSnack();
        setAlert({
          open: true,
          message: `${response.data.message}`,
          severity: "success",
        });
        closeAlert();

        window.location.reload();
      })
      .catch((error) => {
        shoeSnack();
        setAlert({
          open: true,
          message: `${error.message}`,
          severity: "error",
        });
        closeAlert();
      });

    handleClose();
    setSubCategory("");
    setExpanded(true);
    setHiddenField("");
    setSelectCategory("");
    getCategoriesData2();
    setAction(null);
  };

  const getCategoriesData = async (pageNumber = 1) => {
    const keyword = {
      keyword: search === "" ? null : search,
    };

    Api()
      .post(`admin/industries/all/${pageNumber}`, keyword)

      .then((response) => {
        setIsReady(true);
        setCategories(response?.data?.result?.data);
        setCatMessage(response?.data?.result?.data);
        setpageLength(response?.data?.result?.pages);
      })
      .catch((error) => {});
  };

  const getCategoriesData2 = async () => {
    Api()
      .get(`admin/industries`)

      .then((response) => {
        setIsReady(true);
        setSkilla(response?.data);
      })
      .catch((error) => {});
  };

  const getCategoriesData3 = async () => {
    Api()
      .get(`admin/categories`)

      .then((response) => {
        setIsReady2(true);
        setPopData(response?.data);
      })
      .catch((error) => {});
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      getCategoriesData();
    }
  };

  useEffect(() => {
    getCategoriesData(pageNumber);
    getCategoriesData2();
    getCategoriesData3();
  }, []);

  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-4 mb-3">
          <TextField
            id="search"
            className="allJobsSearchPlaceholder"
            label="Search industry or category"
            type="search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearched(e.target.value)}
            onKeyUp={handleSearch}
            size="small"
            style={{
              backgroundColor: "white",
              marginTop: "5px",
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
        <div className="col-md-3 mb-3 mt-1">
          <Button
            variant="contained"
            className="btn searchfilterBtn"
            onClick={handleFilter}
          >
            Search
          </Button>
        </div>
        <div className="col-md-5 mb-3 pt-1" align="right">
          <Button
            variant="contained"
            className="btn searchfilterBtn1"
            startIcon={<AddIcon style={{ fontSize: "30px" }} />}
            onClick={() => {
              setAction(null);
              openDeleteDia();
            }}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* ADD CATEGORY DIALOG BOX   */}
      <Dialog
        open={openDeleteDialog}
        maxWidth="sm"
        fullWidth
        className="dialogborder"
      >
        <div>
          <DialogContent className="text-center">
            <Icon
              path={mdiClose}
              size={1}
              horizontal
              vertical
              onClick={handleClose}
              className="close"
              rotate={180}
              style={{ float: "right" }}
            />
            <div style={{ padding: "60px" }}>
              <div className="row mb-3">
                <div className="col-md-12">
                  <h6>
                    {(!action && <b>Add Category</b>) ||
                      (action && <b>Update Category</b>)}
                  </h6>
                </div>
              </div>

              {/* DROPDOWN */}
              <div className="row">
                <div className="col-md-12 mt-2">
                  <TextField
                    required={expanded}
                    asterisk={expanded}
                    label="Industry"
                    select
                    variant="outlined"
                    size="small"
                    className=""
                    style={{
                      marginBottom: "35px",
                      textTransform: "capitalize",
                    }}
                    fullWidth
                    value={selectCategory}
                    onChange={handleClick}
                  >
                    {!action && (
                      <MenuItem value="createcategory">
                        <div className="d-flex" style={{ color: "#2E405B" }}>
                          <Icon
                            path={mdiPlusThick}
                            title="Edit"
                            size={1}
                            horizontal
                            vertical
                            rotate={180}
                            type="button"
                          />
                          Create new industry
                        </div>
                      </MenuItem>
                    )}
                    {skilla &&
                      skilla.map((skills) => {
                        return (
                          <MenuItem
                            style={{ textTransform: "capitalize" }}
                            value={skills.id}
                            key={skills.id}
                          >
                            {skills.name}
                          </MenuItem>
                        );
                      })}
                  </TextField>
                </div>
              </div>

              {/* HIDDEN TEXTFIELD */}
              <div className="row ">
                <div className="col-md-12 ">
                  <TextField
                    required
                    asterisk
                    hidden={expanded}
                    id="question"
                    type="text"
                    variant="outlined"
                    style={{ marginBottom: "35px" }}
                    label="Enter industry name"
                    size="small"
                    value={hiddenfield}
                    onChange={(e) => setHiddenField(e.target.value)}
                    fullWidth
                    className=""
                  />
                </div>
              </div>

              {/* Sub category */}
              {!action && (
                <div className="row">
                  <div className="col-md-12 ">
                    <TextField
                      label="Sub-category"
                      required={expanded}
                      asterisk={expanded}
                      className=""
                      type="text"
                      variant="outlined"
                      style={{ marginBottom: "35px" }}
                      size="small"
                      fullWidth
                      value={subcategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {action && (
                <div className="row mb-5">
                  <div className="col-md-12 ">
                    <TextField
                      label="Sub-category"
                      className=""
                      type="text"
                      select
                      variant="outlined"
                      style={{ marginBottom: "35px" }}
                      size="small"
                      fullWidth
                      value={subcategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      style={{ textTransform: "capitalize" }}
                    >
                      {categoryForUpdate &&
                        categoryForUpdate.map((subCate) => {
                          return (
                            <MenuItem
                              style={{ textTransform: "capitalize" }}
                              value={subCate.id}
                              key={subCate.id}
                            >
                              {subCate.name}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-md-12" align="center">
                  <Button
                    variant="contained"
                    className="btn"
                    type="submit"
                    onClick={() => {
                      (!action && addNewCategory()) ||
                        (action && deleteAndSaveCategory());
                    }}
                  >
                    {loading && (
                      <div>
                        <ClipLoader size={15} color="#1b98e0" loading />
                      </div>
                    )}
                    {loading
                      ? ""
                      : (!action && "Save Category") ||
                        (action && "Update Category")}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {!isReady && !isReady2 ? (
        <div className="d-flex justify-content-center align-item-center mt-5">
          <ClipLoader size={40} color="#1b98e0" loading />
        </div>
      ) : (
        <div
          className={
            popData?.length <= 0 && catMessage?.length <= 0 && pageNumber <= 0
              ? "mt-4"
              : "row mt-4"
          }
        >
          {pageNumber === 1 ? (
            <div className="col-md-4 ">
              <Card
                className="mt-3"
                style={{ color: "#2E405B", marginBottom: "12px" }}
              key={'one'}
              >
                <CardContent
                  gutterbottom="true"
                  style={{
                    color: "#2E405B",
                    cursor: "default",
                    textTransform: "capitalize",
                  }}
                 
                >
                  <div className="d-flex justify-content-between">
                    <p>I.T industries</p>
                  </div>
                </CardContent>
              </Card>
              <Card
                style={{
                  color: "#2E405B",
                  marginBottom: "12px",
                  overflow: "auto",
                  height: "405px",
                }}
                key={'two'}
               
              >
                <CardContent
                  gutterbottom="true"
                  style={{
                    color: "#2E405B",
                    cursor: "default",
                    textTransform: "capitalize",
                  }}
                
                >
                  {popData?.map((pop) => (
                    <Card
                      style={{
                        backgroundColor: "#2E405B26",
                       
                        marginBottom: "12px",
                      }}
                      key={popData.id}
                    >
                      <CardContent
                        gutterbottom="true"
                        
                        style={{
                          color: "#2E405B",
                          cursor: "default",
                          textTransform: "capitalize",
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <p
                            title={
                              pop?.category && pop?.category?.length > 21
                                ? pop?.category
                                : ``
                            }
                          >
                            {pop?.category}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : null}

          {popData?.length <= 0 &&
          catMessage?.length <= 0 &&
          pageNumber <= 0 ? (
            <Card
              className="mt-1"
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                cursor: "pointer",
                padding: "35px",
              }}
              
            >
              <div className="row text-center">
                <div className="col-md-12 mt-4">
                  <img
                    src="/images/Group 2456.png"
                    alt="no job posted"
                    width="230"
                  />
                  <div className="d-flex justify-content-center align-item-center">
                    <p>
                      No industry has been added at the moment. Please add some
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            
            categories?.map((cat) => (
              <LocalCategoryCard
                categories={categories}
                cat={cat}
                key={cat.id}
                page={pageNumber}
                changeData={changeData}
              />
            ))
          )}
        </div>
      )}

      {catMessage?.length <= 0 ? null : (
        <div className="d-flex justify-content-center mt-5 mb-5">
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
