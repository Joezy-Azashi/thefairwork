import {
  Button,
  InputAdornment,
  Dialog,
  DialogContent,
  Snackbar,
  Card,
  TextField,
  MenuItem
} from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@mdi/react";
import { mdiMagnify, mdiPlusThick } from "@mdi/js";
import { useEffect, useState } from "react";
import Api from "../../Services/api";
import CategoryCard from "./CategoryCard";
import { ClipLoader } from "react-spinners";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { Pagination } from "@material-ui/lab";
import { Alert } from "@material-ui/lab";
import { mdiClose } from "@mdi/js";

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
  const [loading, setLoading] = useState(false);
  const [pageLength, setpageLength] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catMessage, setCatMessage] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [skilla, setSkilla] = useState();
  const [skillId, setskillId] = useState()
  const [categoryForUpdate, setcategoryForUpdate] = useState([])
  const [expanded, setExpanded] = useState(true);
  const [selectCategory, setSelectCategory] = useState("");
  const [Categorytest, setCategorytest] = useState("");
  const [hiddenfield, setHiddenField] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [subcategorytest, setSubCategoryTest] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [search, setSearched] = useState("");
  const [open, setOpen] = useState(false);
  const[limit,setLimit]=useState(false)

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteWithSave, setDeleteWithSave] = useState(false);
  const [dataToChange, setDataToChange] = useState({});
  const [action, setAction] = useState(null);
  const [newCatId, setNewCatId] = useState();

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

  const changeData = (oldCategory) => {
    setDataToChange(oldCategory);
    setAction("delete");
    openDeleteDia();
  };

  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const history = useHistory();
  const dispatch = useDispatch();

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
    // setAction(null)
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);

    await getCategoriesData(value);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const hiddenField = (e) => {
    setHiddenField(e.target.value);
    setLimit(false)
  }

  const handleClick = (e) => {
    setLimit(true)
    if (e.target.value == "createcategory") {
      setSelectCategory(e.target.value);
      setExpanded(false);
      setLimit(false)
    } else {
      setSelectCategory(e.target.value);

      setskillId(e.target.value)
      const result = skilla.find(({ id }) => id === e.target.value);
      setcategoryForUpdate(result?.Categories)
      setExpanded(true);
    }
  };

  const addNewCategory = async (e) => {

    if(selectCategory == "createcategory" && hiddenfield === "") {
      shoeSnack();
      setAlert({
        open: true,
        message: ` Category name cannot be empty`,
        severity: "error",
      });
      closeAlert();
      return
  }

  if(selectCategory !== "createcategory" && subcategory === ""){
    shoeSnack();
    setAlert({
      open: true,
      message: ` Sub category cannot be empty`,
      severity: "error",
    });
    closeAlert();
    return
  }
  
    //accept name, subcategory
    if (selectCategory == "createcategory") {
      const data = {
        category: hiddenfield.toLocaleLowerCase(),
        categoryLink: Categorytest ? Categorytest : null,

        // subCategory: { category: subcategory.toLocaleLowerCase() },
      };

      if (!["", null].includes(subcategory)) {
        data.subCategory = {
          category: subcategory ? subcategory.toLocaleLowerCase() : null,
          subCategoryLink: subcategorytest ? subcategorytest : null,
        };
      }

      Api()
        .post(`admin/categories/create/`, data)

        .then(async (response) => {
          shoeSnack();

          setAlert({
            open: true,
            message: `${response.data.message}`,
            severity: "success",
          });
          closeAlert();
          await getCategoriesData(pageNumber);
          await getCategoriesData2();
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
    } else {
      const data = {
        subCategory: {
          category: subcategory ? subcategory.toLocaleLowerCase() : null,
          subCategoryLink: subcategorytest ? subcategorytest : null,
        },
        categoryLink: Categorytest ? Categorytest : null,
      };
      Api()
        .put(`admin/categories/update/${selectCategory}`, data)
        .then((response) => {
          shoeSnack();
          if (response.status === 201) {
            setAlert({
              open: true,
              message: `${response.data.message}`,
              severity: "success",
            });
            closeAlert();
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
    }
    handleClose();
    setSubCategory("");
    setExpanded(true);
    setHiddenField("");
    setSelectCategory("");
    setCategorytest("");
    setSubCategoryTest("");
    getCategoriesData2();
  };

  const deleteAndSaveCategory = async () => {
    const data = {
      newId: selectCategory,
      newSubCategoryId: subcategory ? subcategory : null,
    };

    Api()
      .post(`/admin/categories/delete/${dataToChange}`, data)
      .then((response) => {
        shoeSnack();

        setAlert({
          open: true,
          message: `${response.data.message}`,
          severity: "success",
        });
        closeAlert();
        setTimeout(() => {
          window.location.reload();
        }, 2000)
        
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
    setCategorytest("");
    setSubCategoryTest("");
    getCategoriesData2();
    setAction(null);
  };

  const handleFilter = () => {
    getCategoriesData();
  };

  const getCategoriesData = async (pageNumber = 1) => {
    const keyword = {
      keyword: search === "" ? null : search,
    };

    Api()
      .post(`admin/categories/all/${pageNumber}`, keyword)

      .then((response) => {
        setIsReady(true);
        setCategories(response?.data?.result?.data);
        setCatMessage(response.data);
        setpageLength(response?.data?.result?.pages);
      })
      .catch((error) => {});
  };

  const getCategoriesData2 = async () => {
    Api()
      .get(`admin/categories`)

      .then((response) => {
        setIsReady(true);
        setSkilla(response?.data);
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
  };

  const handleSearch = (e) => {
    if (e.key == "Enter") {
      getCategoriesData();
    }
  };

  useEffect(() => {
    getCategoriesData();
    getCategoriesData2();
   
  }, []);

  return (
    <div>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <TextField
            id="search"
            label="Search industry or category"
            type="search"
            variant="outlined"
            className=" allJobsSearchPlaceholder"
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
        fullWidth
        maxWidth="sm"
        fullWidth
        className="dialogborder"
      >
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
                  {(!action && <b>Add Category </b>) ||
                    (action && <b>Update Category </b>)}
                </h6>
              </div>
            </div>

            {/* DROPDOWN */}
            <div className="row">
              <div className="col-md-12 mt-4">
                <TextField
                  label="Category"
                  className=""
                  select
                  style={{ marginBottom: "35px", textTransform: "capitalize" }}
                  variant="outlined"
                  size="small"
                  id="catlabel"
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
                        Create new category
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
                          {skills.category}
                          
                          
                        </MenuItem>
                      );
                    })}
                </TextField>
              </div>
            </div>

            {/* HIDDEN TEXTFIELD */}
            <div className="row">
              <div
                className="col-md-12 "
                style={{ marginBottom: expanded ? "0px" : "35px" }}
              >
                <TextField
                  hidden={expanded}
                  type="text"
                  variant="outlined"
                  required
                  asterisk
                  label="Enter category name"
                  size="small"
                  className=""
                  value={hiddenfield}
                  onChange={hiddenField}
                  fullWidth
                />
              </div>
            </div>

            {!action && (
              <div className="row ">
                <div className="col-md-12 ">
                  <TextField
                    type="text"
                    variant="outlined"
                    style={{ marginBottom: "35px" }}
                    label="Category Test link"
                    className=""
                    size="small"
                    value={Categorytest}
                    onChange={(e) => setCategorytest(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
            )}

            {
              !action && (
                <div className="row">
                <div className="col-md-12 ">
                  <TextField
                    label="Sub-category"
                    className=""
                    required = {limit === true}
                    asterisk
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
              )
            }

            {/* Sub category */}
            {
              action && (
                <div className="row">
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
                    style={{textTransform: "capitalize"}}
                  >

                {categoryForUpdate &&
                    categoryForUpdate.map((subCate) => {
                      return (
                        <MenuItem
                          style={{ textTransform: "capitalize" }}
                          value={subCate.id}
                          key={subCate.id}
                        >
                          {subCate.category}
                        </MenuItem>
                      );
                    })}
                   </TextField>
                </div>
              </div>
              )
            }

            {!action && (
              <div className="row">
                <div className="col-md-12 ">
                  <TextField
                    id="catlabel"
                    label="Sub-category Test link"
                    type="text"
                    className=""
                    variant="outlined"
                    style={{ marginBottom: "35px" }}
                    size="small"
                    fullWidth
                    value={subcategorytest}
                    onChange={(e) => setSubCategoryTest(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-12 mt-5" align="center">
                <Button
                  variant="contained"
                  className="btn"
                  type="submit"
                  onClick={(action && deleteAndSaveCategory) || addNewCategory}
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
      </Dialog>

      <div
        className={
          catMessage?.message === "No categories found." ? "mt-4" : "row mt-4"
        }
      >
        {!isReady && (
          <div className="d-flex justify-content-center align-item-center mt-5">
            <ClipLoader size={40} color="#1b98e0" loading />
          </div>
        )}
        {catMessage.message === "No categories found." ? (
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
                  <p>No category has been added at the moment</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          categories?.map((cat) => (
            <CategoryCard
              categories={categories}
              cat={cat}
              key={cat.id}
              page={pageNumber}
              changeData={changeData}
            />
          ))
        )}
      </div>

      {catMessage.message === "No categories found." ? null : (
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
