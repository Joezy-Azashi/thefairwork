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
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";
import { NavLink } from "react-router-dom";
import Api from "../../Services/api";
import { useHistory } from "react-router";
import ChildPages from "../ChildPages";
import axios from 'axios'

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

function HomepageNavbar() {

  const history = useHistory();
  const [pages, setPages] = useState([]);
  const [openSideNav, setOpenSideNav] = useState(false);
  const [showChils, setshowChils] = useState(false);
  const [childData, setchildData] = useState();
  const [grandchildData, setGrandchildData] = useState();
  const [pagesIndex, setPagesIndex] = useState();
  const [countryName, setCountryName] = useState([]);
  const [showButton, setShowButton] = useState(false);


  const handleOpenSideNav = () => {
    setOpenSideNav(!openSideNav);
  };

  const handleCloseSideNav = () => {
    setOpenSideNav(false);
  };

  const classes = useStyles();

  const [navBar, setNavBar] = useState(false);
  const [open, setOpen] = useState(true);

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
              { params: homeTabs }
            );
      })
      .catch((error) => {});
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


  // endpoint to check country of where the user is accessing the website
  const getCountryName = () => {
    axios.get(`https://geolocation-db.com/json/`)
      .then((response) => {
        setCountryName(response?.data?.country_name);
        setShowButton(true)
      })
      .catch((error) => {});
  };
  


  useEffect(() => {
    // getPages();
    getCountryName()
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

  window.addEventListener("scroll", function () {
    var scroll = document.querySelector(".scrollTop");
    scroll && scroll.classList.toggle("active", window.scrollY > 200);
  });
  function scrollToTop() {
    window.scrollTo({
      top: 0,
    });
  }

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
            <a href="/">
              <img
                src="./images/fw_logo.png"
                alt="logo"
                className="homepageBrand"
              />
            </a>
            </div>

          <div className="d-flex">
          {/* <div
            className="adminPagesHomePage"
            onMouseLeave={() => {
              setshowChils(false);
            }}
          >
            {window.location.pathname === "/" ||
            window.location.pathname === "/page" ? (
              <div className="d-flex justify-content-center text-center">
                {pages?.map((homeTabs, index) => {
                  return (
                    <div key={index} style={{ padding: "0 15px" }}>
                      <div
                        className="homepage-navLink"
                        onClick={() => {
                          getSinglePage(homeTabs);
                        }}
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
                          color="#2E405B"
                          rotate={180}
                        />
                        : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              ``
            )}

            <div style={{ position: "absolute" }}>
              <ChildPages
                showChils={showChils}
                childData={childData}
                pagesIndex={pagesIndex}
              />
            </div>
          </div> */}
          

          <div className="d-flex">
            {window.location.pathname === "/" || window.location.pathname === "/about-us" || window.location.pathname === "/become-a-client"|| window.location.pathname === "/become-a-freelancer" || window.location.pathname === "/privacy-policy"  ? (
              <>
              <div className={classes.sectionDesktop}>
                  <a className="navLink mt-1" href="/about-us">
                    About Us
                  </a>
                </div>
                {
                  showButton && countryName === `Ghana` ? (
                    <div className={classes.sectionDesktop}>
                    <NavLink className="navLink" to={"/recruiter-login"}>
                      <Button variant="contained" className="btn">
                        Ghana Recruiter
                      </Button>
                    </NavLink>
                  </div>
                  ) : (
                    ``
                  )
                }
                
                <div className={classes.sectionDesktop}>
                  <NavLink className="navLink mt-1" to={"/signup"}>
                    Sign Up
                  </NavLink>
                </div>
                <div className={classes.sectionDesktop}>
                  <NavLink className="navLink mt-1" to={"/login"}>
                    Login
                  </NavLink>
                </div>
              </>
            ) : (
              ""
            )}
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
              {
                showButton && countryName === `Ghana` ? (
                  <div className="mt-3">
                  <a href="/recruiter-login" className="navLink">
                    <MenuItem>
                      <Button variant="contained" className="">
                        Ghana Recruiter
                      </Button>
                    </MenuItem>
                  </a>
                </div>
                ) : (
                  ``
                )
              }
           
              <div>
                <a href="/signup-options" className="navLink text-light">
                  <MenuItem>Sign Up</MenuItem>
                </a>
              </div>

              <div>
                <a href="/login" className="navLink text-light">
                  <MenuItem>Login</MenuItem>
                </a>
              </div>

              <hr />

              <div>
              <a href="/about-us" className="navLink text-light">
              <MenuItem>About Us</MenuItem>
              </a>
              </div>

              {/* <List component="nav">
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
                                          <ListItem
                                            button
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
              </List> */}
            </DialogContent>
          </Dialog>
        </div>
      </AppBar>

      <span className=" scrollTop" onClick={() => scrollToTop()}>
        <KeyboardArrowUpIcon fontSize="large" style={{ color: "white" }} />
      </span>
    </div>
  );
}
export default HomepageNavbar;
