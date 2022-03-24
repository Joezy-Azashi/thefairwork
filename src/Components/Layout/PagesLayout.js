import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import {
  MenuItem,
  Dialog,
  DialogContent,
  Toolbar,
  IconButton,
  AppBar,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";
import { NavLink } from "react-router-dom";
import Api from "../../Services/api";
import { useHistory } from "react-router";
import ChildPages from "../ChildPages";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "block",
  },
  sectionDesktop: {
    margin: "10px",
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function PagesLayout() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const history = useHistory();
  const [pages, setPages] = useState([]);
  const [openSideNav, setOpenSideNav] = React.useState(false);
  const [pageData, setpageData] = useState([]);
  const [showChils, setshowChils] = useState(false);
  const [childData, setchildData] = useState();
  const [grandchildData, setGrandchildData] = useState();
  const [pagesIndex, setPagesIndex] = useState();

  const handleOpenSideNav = () => {
    setOpenSideNav(true);
  };

  const handleCloseSideNav = () => {
    setOpenSideNav(false);
  };

  const classes = useStyles();

  const [navBar, setNavBar] = useState(false);

  const getPages = async () => {
    Api()
      .get("/pages/all-pages")
      .then((response) => {
        setPages(response?.data);
      })
      .catch((error) => {});
  };

  const getSinglePage = async (homeTabs) => {
    Api()
      .get(`/pages/${homeTabs?.id}`)
      .then((response) => {
        homeTabs?.Pages?.length > 0
          ? history.push("#")
          : history.push(
              `/page/${(homeTabs?.title).toLowerCase().split(" ").join("-")}`,
              { params: homeTabs },
              handleCloseSideNav()
            );
            
      })
      .catch((error) => {
      });
  };

  /***Navbar color change on scroll***/
  const changeBackground = () => {
    if (window.scrollY >= 100) {
      setNavBar(true);
    } else {
      setNavBar(false);
    }
  };
  window.addEventListener("scroll", changeBackground);
  /***End of Navbar color change on scroll***/

  useEffect(() => {
    getPages();
  }, []);

  const [selectedIndex, setSelectedIndex] = useState("");
  const [selectedIndex2, setSelectedIndex2] = useState("");

  const handleClick1 = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex("");
    } else {
      setSelectedIndex(index);
    }
  };

  const handleClick2 = (index) => {
    if (selectedIndex2 === index) {
      setSelectedIndex2("");
    } else {
      setSelectedIndex2(index);
    }
  };

  return (
    <div className={classes.grow}>
      <AppBar className={navBar ? "navBar active" : "navBar"}>
        <Toolbar className="navcontainer d-flex justify-content-between">
          <div className="d-flex">
            <IconButton
              edge="start"
              className="menuButton"
              color="inherit"
              aria-label="open drawer"
              onClick={handleOpenSideNav}
            >
              <MenuIcon />
            </IconButton>
            <NavLink to="/">
              <img
                src="../images/fw_logo.svg"
                alt="logo"
                className="homepageBrand"
              />
            </NavLink>
            </div>
          
            <div className="d-flex">
          <div
            className="adminPagesHomePage"
            onMouseLeave={() => {
              setshowChils(false);
            }}
          >
            <div className="d-flex justify-content-center text-center">
              {pages?.map((homeTabs, index) => {
                return (
                  <div key={index} style={{ padding: "0 15px" }}>
                    <div
                      className="homepage-navLink"
                      onClick={() => {
                        getSinglePage(homeTabs);
                      }}
                      style={{ color: "white" }}
                      onMouseOver={() => {
                        setshowChils(true);
                        setchildData(homeTabs);
                        setPagesIndex(index);
                      }}
                    >
                      {homeTabs?.title}
                      {homeTabs?.Pages?.length > 0 ? 
                        <Icon
                          path={mdiChevronDown}
                          size={0.8}
                          horizontal
                          vertical
                          color="#FFFFFF"
                          rotate={180}
                        />
                        : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ position: "absolute" }}>
              <ChildPages
                showChils={showChils}
                childData={childData}
                pagesIndex={pagesIndex}
              />
            </div>
          </div>

          <div className="d-flex">
            <div className={classes.sectionDesktop}>
              <NavLink className="navLink" to={"/recruiter-login"}>
                <Button variant="contained" className="btn">
                  Ghana Recruiter
                </Button>
              </NavLink>
            </div>
            <div className={classes.sectionDesktop}>
              <NavLink
                className="navLink mt-1"
                to={"/signup"}
                style={{ color: "white" }}
              >
                Sign Up
              </NavLink>
            </div>
            <div className={classes.sectionDesktop}>
              <NavLink
                className="navLink mt-1"
                to={"/login"}
                style={{ color: "white" }}
              >
                Login
              </NavLink>
            </div>
          </div>
          </div>
        </Toolbar>
        <div>
          <Dialog
            open={openSideNav}
            onClose={handleCloseSideNav}
            TransitionComponent={Transition}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            // disableBackdropClick
            hideBackdrop
            className="dialogborder"
          >
            <DialogContent
              style={{
                position: "fixed",
                left: "0",
                top: "70px",
                height: "100%",
                width: "300px",
                backgroundColor: "#2E405B",
                color: "white",
                padding: "0",
              }}
            >
              <div className="mt-3">
                <a href="/recruiter-login" className="navLink">
                  <MenuItem>
                    <Button variant="contained" className="">
                      Ghana Recruiter
                    </Button>
                  </MenuItem>
                </a>
              </div>
              <div>
                <a href="/signup" className="navLink text-light">
                  <MenuItem>Sign Up</MenuItem>
                </a>
              </div>

              <div>
                <a href="/login" className="navLink text-light">
                  <MenuItem>Login</MenuItem>
                </a>
              </div>

              <hr />

              <List component="nav">
                {pages?.map((homeTabs, index) => {
                  return (
                    <List>
                      <ListItem
                        key={index}
                        button
                        onClick={() => {
                          handleClick1(index);
                          setchildData(homeTabs);
                          getSinglePage(homeTabs);
                        }}
                      >
                        <ListItemText primary={homeTabs.title} />

                        {homeTabs.Pages.length === 0 ? (
                          ""
                        ) : index === selectedIndex ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Collapse
                        in={index === selectedIndex}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {childData?.Pages?.map((sub, index) => {
                            return (
                              <>
                                <ListItem
                                key={index}
                                  button
                                  onClick={() => {
                                    handleClick2(index);
                                    setGrandchildData(sub);
                                    getSinglePage(sub);
                                  }}
                                >
                                  <ListItemText
                                    primary={sub?.title}
                                    style={{
                                      color: "white",
                                      marginLeft: "15px",
                                    }}
                                  />
                                  {sub?.Pages.length === 0 ? (
                                    ""
                                  ) : index === selectedIndex2 ? (
                                    <ExpandLess />
                                  ) : (
                                    <ExpandMore />
                                  )}
                                </ListItem>
                                <Collapse
                                  in={index === selectedIndex2}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <List component="div" disablePadding>
                                    {grandchildData?.Pages?.map(
                                      (grand, index) => {
                                        return (
                                          <ListItem button
                                          onClick={() => {
                                            getSinglePage(grand);
                                          }}
                                          >
                                            <ListItemText
                                              primary={grand?.title}
                                              style={{
                                                color: "white",
                                                marginLeft: "30px",
                                              }}
                                            />
                                          </ListItem>
                                        );
                                      }
                                    )}
                                  </List>
                                </Collapse>
                              </>
                            );
                          })}
                        </List>
                      </Collapse>
                    </List>
                  );
                })}
              </List>
            </DialogContent>
          </Dialog>
        </div>
      </AppBar>
    </div>
  );
}

export default PagesLayout;
