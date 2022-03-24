import * as React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import {
  TextField,
  Button,
  InputAdornment,
  Card,
  DialogContent,
  Dialog,
} from "@mui/material";
import Icon from "@mdi/react";
import {
  mdiMagnify,
  mdiSquareEditOutline,
  mdiDeleteOutline,
  mdiBookmarkMultipleOutline,
  mdiClockOutline,
} from "@mdi/js";
import { useSpring, animated } from "react-spring";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router";
import Api from "../Services/api";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import Pagination from "@material-ui/lab/Pagination";

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed #009e20}`,
  },
}));

const StyledTreeItem1 = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({}));

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

export default function AdminPages() {
  const classes1 = usePageStyles();
  const history = useHistory();
  const [pages, setPages] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [loading, setloading] = useState(false);
  const [openDeletePageDia, setopenDeletePageDia] = useState(false);
  const [parentIdforDelete, setParentIdforDelete] = useState();
  const [childId, setChildId] = useState();
  const [grandChild, setGrandChild] = useState();
  const [parentData, setParentData] = useState();
  const [query, setQuery] = useState("");

  const handleClick = () => {
    history.push("/add-admin-page");
  };

  const SendDataToAddPage = () => {
    history.push("/add-admin-page", { params: `editMode` });
  };

  const closeParentDelete = () => {
    setopenDeletePageDia(false);
  };

  const openDeleteDia = () => {
    setopenDeletePageDia(true);
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await getPages(value);
  };
  const treeViewNodeList = () => {
    return Array(60)
      .fill(0)
      .map((e, i) => i.toString());
  };

  const deletePage = () => {
    Api()
      .delete(
        `/pages/${
          parentIdforDelete !== undefined
            ? parentIdforDelete
            : childId !== undefined
            ? childId
            : grandChild !== undefined
            ? grandChild
            : ``
        }`
      )
      .then(async (response) => {
        window.location.reload();
      })
      .catch((error) => {});
  };

  const getPages = async (pageNumberSelected = 1) => {
    const data = {
      title: query,
    };
    Api()
      .post(
        `/pages/all-pages-paginated?currentPage=${pageNumberSelected}`,
        data
      )
      .then((response) => {
        setIsReady(true);
        setPages(response?.data?.data);

        setpageLength(response?.data?.pages);
        localStorage.clear("parentData");
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getPages();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-3 pageTitle">
          <h6>
            <b>Pages</b>
          </h6>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <TextField
            id="search"
            label="Search page"
            type="search"
            variant="outlined"
            size="small"
            value={query}
            fullWidth
            className="allJobsSearchPlaceholder"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            style={{ backgroundColor: "white" }}
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
        <div className="col-md-2 mb-4">
          <Button
            variant="contained"
            className="searchOrderBtn w-100"
            onClick={() => {
              getPages();
            }}
          >
            Search
          </Button>
        </div>

        <div className="col-md-3" />

        <div
          className="col-md-3 mb-5"
          align="right"
          onClick={() => {
            handleClick();
          }}
        >
          <Button
            variant="contained"
            className="addPageBtn btn"
            startIcon={<AddIcon style={{ fontSize: "30px" }} />}
          >
            Add page
          </Button>
        </div>
      </div>

      <TreeView
        defaultExpanded={treeViewNodeList()}
        className="mb-5"
      >
        {!isReady ? (
          <div className="d-flex justify-content-center align-item-center">
            <ClipLoader size={40} color="#1b98e0" loading />
          </div>
        ) : pages?.length <= 0 ? (
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
              <img src="/images/Group 2459.png" alt="no job posted" />
              <p>There are no pages created on the platform currently.</p>
            </div>
          </div>
        </Card>
    
        ) : (
          pages?.map((page, pageIndex) => {
            return (
              <>
                <StyledTreeItem1 nodeId={pageIndex.toString()} className="" style={{marginLeft: "0"}}>
                  <Card
                    className="mt-1 mb-3"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                      cursor: "default",
                      padding: "18px",
                    }}
                  >
                    <div className="row ">
                      <div className="col-md-10">
                        <p className="bodyTitles mt-2 ">{page?.title}</p>
                      </div>
                      <div className="col-md-2 adminViewPageBtn">
                        <div class="d-flex">
                          <div>
                            <Button
                              className="action-button"
                              onClick={() => {
                                setParentData(
                                  localStorage.setItem(
                                    "parentData",
                                    JSON.stringify(page)
                                  )
                                );
                                SendDataToAddPage();
                              }}
                            >
                              <Icon
                                path={mdiSquareEditOutline}
                                title="Edit"
                                size={1.1}
                                horizontal
                                vertical
                                color="#2E405B"
                                rotate={180}
                                type="button"
                                className="adminPageEdit-action p-1"
                              />
                            </Button>
                          </div>
                          <div>
                            <Button
                              className="action-button"
                              onClick={() => {
                                openDeleteDia(true);
                                setParentIdforDelete(page?.id);
                              }}
                            >
                              <Icon
                                path={mdiDeleteOutline}
                                title="Delete"
                                size={1.1}
                                horizontal
                                color="#F70000"
                                vertical
                                rotate={180}
                                type="button"
                                className="adminPageDelete-action p-1"
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12 d-flex">
                        <div className="d-flex">
                          <Icon
                            path={mdiBookmarkMultipleOutline}
                            size={0.8}
                            horizontal
                            color="#2E405B"
                            vertical
                            rotate={180}
                            type="button"
                            style={{ marginRight: "7px" }}
                          />
                          <p style={{ marginRight: "25px" }}>Home</p>
                        </div>
                        <div className="d-flex">
                          <Icon
                            path={mdiClockOutline}
                            size={0.8}
                            horizontal
                            color="#2E405B"
                            vertical
                            rotate={180}
                            type="button"
                            style={{ marginRight: "7px" }}
                          />
                          <p>{moment(page?.createdAt).fromNow()}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  {page.Pages &&
                    page.Pages.map((subPage) => {
                      return (
                        <StyledTreeItem nodeId={(pageIndex + 15).toString()}>
                          <div className="treeTop" />
                          <Card
                            className="mt-1 mb-3"
                            style={{
                              borderRadius: "10px",
                              boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                              cursor: "default",
                              padding: "18px",
                            }}
                          >
                            <div className="row ">
                              <div className="col-md-10">
                                <p className="bodyTitles mt-2 ">
                                  {subPage?.title}
                                </p>
                              </div>
                              <div className="col-md-2 adminViewPageBtn">
                                <div class="d-flex">
                                  <div>
                                    <Button
                                      className="action-button"
                                      onClick={() => {
                                        setParentData(
                                          localStorage.setItem(
                                            "parentData",
                                            JSON.stringify(subPage)
                                          )
                                        );
                                        SendDataToAddPage();
                                      }}
                                    >
                                      <Icon
                                        path={mdiSquareEditOutline}
                                        title="Edit"
                                        size={1.1}
                                        horizontal
                                        vertical
                                        color="#2E405B"
                                        rotate={180}
                                        type="button"
                                        className="adminPageEdit-action p-1"
                                      />
                                    </Button>
                                  </div>
                                  <div>
                                    <Button
                                      className="action-button"
                                      onClick={() => {
                                        openDeleteDia(true);
                                        setChildId(subPage?.id);
                                      }}
                                    >
                                      <Icon
                                        path={mdiDeleteOutline}
                                        title="Delete"
                                        size={1.1}
                                        horizontal
                                        color="#F70000"
                                        vertical
                                        rotate={180}
                                        type="button"
                                        className="adminPageDelete-action p-1"
                                      />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-12 d-flex">
                                <div className="d-flex">
                                  <Icon
                                    path={mdiBookmarkMultipleOutline}
                                    title="Delete"
                                    size={0.8}
                                    horizontal
                                    color="#2E405B"
                                    vertical
                                    rotate={180}
                                    type="button"
                                    style={{ marginRight: "7px" }}
                                  />
                                  <p style={{ marginRight: "25px" }}>
                                    {page.title}
                                  </p>
                                </div>
                                <div className="d-flex">
                                  <Icon
                                    path={mdiClockOutline}
                                    title="Delete"
                                    size={0.8}
                                    horizontal
                                    color="#2E405B"
                                    vertical
                                    rotate={180}
                                    type="button"
                                    style={{ marginRight: "7px" }}
                                  />
                                  <p>{moment(subPage?.createdAt).fromNow()}</p>
                                </div>
                              </div>
                            </div>
                          </Card>

                          {subPage?.Pages?.map((subSubPage) => {
                            return (
                              <StyledTreeItem
                                nodeId={(pageIndex + 45).toString()}
                              >
                                <div className="treeTop" />
                                <Card
                                  className="mt-1 mb-3"
                                  style={{
                                    borderRadius: "10px",
                                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                                    cursor: "default",
                                    padding: "18px",
                                  }}
                                >
                                  <div className="row ">
                                    <div className="col-md-10">
                                      <p className="bodyTitles mt-2 ">
                                        {subSubPage.title}
                                      </p>
                                    </div>
                                    <div className="col-md-2 adminViewPageBtn">
                                      <div class="d-flex">
                                        <div>
                                          <Button
                                            className="action-button"
                                            onClick={() => {
                                              setParentData(
                                                localStorage.setItem(
                                                  "parentData",
                                                  JSON.stringify(subSubPage)
                                                )
                                              );
                                              SendDataToAddPage();
                                            }}
                                          >
                                            <Icon
                                              path={mdiSquareEditOutline}
                                              title="Edit"
                                              size={1.1}
                                              horizontal
                                              vertical
                                              color="#2E405B"
                                              rotate={180}
                                              type="button"
                                              className="adminPageEdit-action p-1"
                                            />
                                          </Button>
                                        </div>
                                        <div>
                                          <Button
                                            className="action-button"
                                            onClick={() => {
                                              openDeleteDia(true);
                                              setGrandChild(subSubPage?.id);
                                            }}
                                          >
                                            <Icon
                                              path={mdiDeleteOutline}
                                              title="Delete"
                                              size={1.1}
                                              horizontal
                                              color="#F70000"
                                              vertical
                                              rotate={180}
                                              type="button"
                                              className="adminPageDelete-action p-1"
                                            />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-12 d-flex">
                                      <div className="d-flex">
                                        <Icon
                                          path={mdiBookmarkMultipleOutline}
                                          title="Delete"
                                          size={0.8}
                                          horizontal
                                          color="#2E405B"
                                          vertical
                                          rotate={180}
                                          type="button"
                                          style={{ marginRight: "7px" }}
                                        />
                                        <p style={{ marginRight: "25px" }}>
                                          {subPage?.title}
                                        </p>
                                      </div>
                                      <div className="d-flex">
                                        <Icon
                                          path={mdiClockOutline}
                                          title="Delete"
                                          size={0.8}
                                          horizontal
                                          color="#2E405B"
                                          vertical
                                          rotate={180}
                                          type="button"
                                          style={{ marginRight: "7px" }}
                                        />
                                        <p>
                                          {moment(
                                            subSubPage?.createdAt
                                          ).fromNow()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </StyledTreeItem>
                            );
                          })}
                        </StyledTreeItem>
                      );
                    })}
                </StyledTreeItem1>
                {pages?.length === undefined || pageLength?.length === 1 ? (
                  ``
                ) : (
                  <div className="d-flex justify-content-center mt-5 mb-5">
                    <Pagination
                      count={pageLength?.length}
                      variant="outlined"
                      page={pageNumber}
                      onChange={handlePageChange}
                      classes={{ ul: classes1.ul }}
                      color="white"
                    />
                  </div>
                )}
              </>
            );
          })
        )}
      </TreeView>
      <div>
        
        {/* DIALOG TO DELETE PAGES */}
        <div>
          <Dialog
            open={openDeletePageDia}
            onClose={closeParentDelete}
            className="dialogborder"
            fullWidth
            maxWidth="xs"
            hideBackdrop
          >
            <DialogContent className="text-center">
              <p>Are you sure you want to delete this page?</p>
              <div className="row justify-content-center text-center">
                <div className="col-md-6 mb-2" align="right">
                  <Button
                    variant="outlined"
                    className="btn w-100"
                    onClick={closeParentDelete}
                  >
                    No
                  </Button>
                </div>
                <div className="col-md-6" align="left">
                  <Button
                    variant="outlined"
                    className="w-100"
                    type="submit"
                    onClick={deletePage}
                  >
                    {loading && (
                      <div style={{ marginRight: "5px" }}>
                        <ClipLoader size={15} color="#1b98e0" loading />
                      </div>
                    )}
                    {loading ? "" : "Yes"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* DIALOG TO DELETE PAGES */}
      </div>
    </>
  );
}
