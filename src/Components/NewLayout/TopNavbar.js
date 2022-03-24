import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Collapse } from "@material-ui/core";
import { mdiAccountGroupOutline } from "@mdi/js";
import { useLocation } from "react-router-dom";
import logoImage from "../../assets/images/fw_logo.png";
import {
  Dialog,
  DialogContent,
  Slide,
  List,
  ListItem,
  ListItemText,
  Menu,
  Badge,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Tab,
  Tabs,
} from "@material-ui/core";
import Icon from "@mdi/react";
import { frontURL } from "../../public/config";
import {
  mdiAccountMultipleOutline,
  mdiBriefcaseSearchOutline,
  mdiBriefcaseVariantOutline,
  mdiBriefcaseAccountOutline,
  mdiViewDashboardOutline,
  mdiMonitorDashboard,
  mdiFileDocumentMultipleOutline,
  mdiShoppingOutline,
  mdiAccountSupervisorOutline,
  mdiAccountSearchOutline,
  mdiMenu,
  mdiBookOpenPageVariantOutline,
  mdiChevronDown,
  mdiAccountTieOutline,
  mdiCashMultiple,
} from "@mdi/js";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { logoutUser } from "../../Services/auth";
import Api from "../../Services/api";
import { getCurrentUser } from "../../Services/auth";
import { getUserType } from "../../Services/auth";
import { useHistory } from "react-router-dom";
import cx from "classnames";
import { localRecruiterRole, recruiterRole } from "../../Services/userTypes";
import { parse } from "date-fns/esm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const drawerWidth = 280;

const getLocation = () => {
  return window.location.pathname;
};

const currrentLocation = window.location.pathname;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    marginRight: "25px",
    backgroundColor: "#2E405B ",
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    // flexGrow: 1,
  },
}));

const currentTab = () => {
  let path = window.location.pathname;
  if (getUserType()?.accountTypeId === 3 && path === "/admin-dashboard")
    return 0;
  else if (
    getUserType()?.accountTypeId === 2 &&
    path === "/freelancer-all-jobs"
  )
    return 0;
  else if (getUserType()?.accountTypeId === 2 && path === "/local-jobs")
    return 1;
  else if (getUserType()?.accountTypeId === 1 && path === "/candidate-pool")
    return 0;
  else if (getUserType()?.accountTypeId === 1 && path === "/all-jobs") return 1;
  else if (getUserType()?.accountTypeId === 1 && path === "/applicants")
    return 2;
  else if (getUserType()?.accountTypeId === 1 && path === "/team-orders")
    return 3;
  else if (getUserType()?.accountTypeId === 1 && path === "/order-in-process")
    return 3;
  else if (getUserType()?.accountTypeId === 1 && path === "/order-completed")
    return 3;
  else if (getUserType()?.accountTypeId === 1 && path === "/order-canceled")
    return 3;
  else if (getUserType()?.accountTypeId === 1 && path === "/view-payments")
    return 3;
  else if (getUserType()?.accountTypeId === 1 && path === "/client-payment-due")
    return 4;
  else if (getUserType()?.accountTypeId === 1 && path === "/client-invoices")
    return 4;
  else if (getUserType()?.accountTypeId === 3 && path === "/user-freelancers")
    return 1;
  else if (getUserType()?.accountTypeId === 3 && path === "/user-clients")
    return 1;
  else if (getUserType()?.accountTypeId === 3 && path === "/user-recruiters")
    return 1;
  else if (getUserType()?.accountTypeId === 3 && path === "/local-category")
    return 2;
  else if (getUserType()?.accountTypeId === 3 && path === "/platform-category")
    return 2;
  else if (getUserType()?.accountTypeId === 3 && path === "/project-tools")
    return 2;
  else if (getUserType()?.accountTypeId === 3 && path === "/paymentlevels")
    return 2;
  else if (getUserType()?.accountTypeId === 3 && path === "/team-orders")
    return 3;
  else if (getUserType()?.accountTypeId === 3 && path === "/orders-in-process")
    return 3;
  else if (getUserType()?.accountTypeId === 3 && path === "/orders-completed")
    return 3;
  else if (getUserType()?.accountTypeId === 3 && path === "/orders-canceled")
    return 3;
  else if (getUserType()?.accountTypeId === 3 && path === "/admin-all-jobs")
    return 4;
  else if (getUserType()?.accountTypeId === 3 && path === "/view-payments")
    return 3;
  else if (getUserType()?.accountTypeId === 3 && path === "/admin-pages")
    return 5;
  else if (getUserType()?.accountTypeId === 3 && path === "/all-payment-due")
    return 6;
  else if (getUserType()?.accountTypeId === 3 && path === "/all-invoices")
    return 6;
  else if (getUserType()?.accountTypeId === 4 && path === "/recruiter-all-jobs")
    return 0;
  else if (getUserType()?.accountTypeId === 4 && path === "/applicants")
    return 1;
  else if (getUserType()?.accountTypeId === 4 && path === "/view-payments")
    return 2;
};

function TopNavbar({ page }) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [profileImg, setProfileImg] = useState(
    getCurrentUser()?.user?.UserProfile?.profile_picture
  );
  const [profileName, setProfileName] = useState(
    getCurrentUser()?.user?.UserProfile?.firstname
  );
  const [id, setId] = useState(getCurrentUser()?.user?.id);
  const [accountType, setCccountType] = useState(
    getCurrentUser()?.user?.accountTypeId
  );

  const [openProfilePrompt, setOpenProfilePrompt] = useState(false);

  const [teamCount, setteamCount] = useState(
    JSON.parse(localStorage.getItem("teamMember"))
  );

  const [newUser, setNewUser] = useState();
  const location = useLocation();
  const [listOpen, setListOpen] = useState(false);
  const [listFeaturesOpen, setFeaturesListOpen] = useState(false);
  const [listOrdersOpen, setOrdersListOpen] = useState(false);
  const [listPaymentsOpen, setListPaymentsOpen] = useState(false);

  const buttonClass = {
    postJobbtn: true,
    btnOnMobile: true,
    postJobbtnDisabled:
      getUserType()?.isLimited && getUserType().accountTypeId !== 4,
  };
  const buttonClass2 = {
    "mt-3": true,
    postJobBtnDisabled: getUserType()?.isLimited,
  };

  localStorage.setItem("id", id);

  const [newId, setNewId] = useState(localStorage.getItem("id"));

  const handleOpenSubMenu = () => {
    setListOpen(!listOpen);
    handleDrawerOpen();
  };

  const handleOpenFeaturesSubMenu = () => {
    setFeaturesListOpen(!listFeaturesOpen);
    handleDrawerOpen();
  };
  const handleOpenOrdersSubMenu = () => {
    // setOrdersListOpen(!listOrdersOpen);
    // handleDrawerOpen();
    window.location.assign("/team-orders");
  };

  const handleOpenPaymentsSubMenu = () => {
    setListPaymentsOpen(!listPaymentsOpen);
    handleDrawerOpen();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);
  const [anchorE4, setAnchorE4] = React.useState(null);
  const [anchorE5, setAnchorE5] = React.useState(null);
  const [anchorE6, setAnchorE6] = React.useState(null);
  const [anchorE7, setAnchorE7] = React.useState(null);
  const [anchorE8, setAnchorE8] = React.useState(null);
  const [anchorE9, setAnchorE9] = React.useState(null);
  const [anchorFeaturesEl, setFeaturesAnchorEl] = React.useState(null);

  const [profileCheck, setProfileCheck] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const pushToteam = () => {
    history.push("/add-team");
  };

  const routeToProfile = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("fromCandi");
    window.location.assign("/profile");
  };

  const [value, setValue] = useState(currentTab);

  const handleclickSearchJobs = () => {
    window.location.assign("/freelancer-all-jobs");
  };

  const handleclickGhanaJobs = () => {
    window.location.assign("/local-jobs");
  };

  const handleclickAdminDashboard = () => {
    window.location.assign("/admin-dashboard");
  };

  const handleMyJobs = () => {
    window.location.assign("/admin-all-jobs");
  };

  const handleClickAdminAllJobs = () => {
    window.location.assign("/admin-all-jobs");
  };

  const handleClickAdminPages = () => {
    window.location.assign("/admin-pages");
  };

  const handleclickPaymentProcess = () => {
    window.location.assign("/view-payments");
  };

  const handleApplicants = () => {
    window.location.assign("/applicants");
  };

  const handleclickCandidatePool = () => {
    window.location.assign("/candidate-pool");
  };

  const handleRecruiterJobs = () => {
    window.location.assign("/recruiter-all-jobs");
  };

  const handleClientJobs = () => {
    window.location.assign("/all-jobs");
  };

  const handleAdminFreelancers = () => {
    window.location.assign("/user-freelancers");
    localStorage.setItem("freelancers", "freelancers");
  };

  const handleAdminClients = () => {
    window.location.assign("/user-clients");
    localStorage.removeItem("freelancers");
  };

  const handleAdminRecruiters = () => {
    window.location.assign("/user-recruiters");
    localStorage.removeItem("freelancers");
  };

  const handleAddOns = () => {
    window.location.assign("/project-tools");
  };

  const handlePaymentLevels = () => {
    window.location.assign("/paymentlevels");
  };
  const handleGhanaCat = () => {
    window.location.assign("/local-category");
  };

  const handleFreelanceCat = () => {
    window.location.assign("/platform-category");
  };

  const handleAdminNewOrers = () => {
    window.location.assign("/team-orders");
  };

  const handleAdminInProcess = () => {
    window.location.assign("/orders-in-process");
  };

  const handleAdminCompleted = () => {
    window.location.assign("/orders-completed");
  };

  const handleAdminCancelled = () => {
    window.location.assign("/orders-canceled");
  };

  const handleClientNewOrders = () => {
    window.location.assign("/team-orders");
  };
  const handleClientPaymentDue = () => {
    getUserType()?.accountTypeId === 1
      ? window.location.assign("/client-payment-due")
      : window.location.assign("/all-payment-due");
  };
  const handleClientInvoices = () => {
    getUserType()?.accountTypeId === 1
      ? window.location.assign("/client-invoices")
      : window.location.assign("/all-invoices");
  };

  const handleClientInprocess = () => {
    window.location.assign("/order-in-process");
  };

  const handleClientCompleted = () => {
    window.location.assign("/order-completed");
  };

  const handleClientCancelled = () => {
    window.location.assign("/order-canceled");
  };

  const handleAdminJobs = () => {
    window.location.assign("/admin-all-jobs");
  };

  /* For mobile view */
  const handleFeaturesClick = (event) => {
    setFeaturesAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFeatureClose = () => {
    setFeaturesAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleclick = () => {
    history.push("/post-jobs");
  };

  const handleclick1 = () => {
    history.push("/recruiter-post-job");
  };

  const [openSideNav, setOpenSideNav] = React.useState(false);

  const handleOpenSideNav = () => {
    setOpenSideNav(true);
  };

  const handleCloseSideNav = () => {
    setOpenSideNav(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleDropdownClose = () => {
    setAnchorE2(null);
    handleMobileMenuClose();
  };

  const handleRecDropdownClose = () => {
    setAnchorE3(null);
    handleMobileMenuClose();
  };

  const handleAdminDropdownClose = () => {
    setAnchorE4(null);
    handleMobileMenuClose();
  };

  const handleAdminFeatureDropdownClose = () => {
    setAnchorE5(null);
    handleMobileMenuClose();
  };

  const handleAdminOrdersDropdownClose = () => {
    setAnchorE6(null);
    handleMobileMenuClose();
  };

  const handleFreelancerMyjobsDropdownClose = () => {
    setAnchorE7(null);
    handleMobileMenuClose();
  };

  const handleClientOrdersDropdownClose = () => {
    setAnchorE8(null);
    handleMobileMenuClose();
  };

  const handleClientPaymentsDropdownClose = () => {
    setAnchorE9(null);
    handleMobileMenuClose();
  };

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isDropdownOpen = Boolean(anchorE2);
  const isRecDropdownOpen = Boolean(anchorE3);
  const isAdminDropdownOpen = Boolean(anchorE4);
  const isAdminFeatureDropdownOpen = Boolean(anchorE5);
  const isAdminOrdersDropdownOpen = Boolean(anchorE6);
  const isFreelancerMyjobsDropdownOpen = Boolean(anchorE7);
  const isClientOrdersDropdownOpen = Boolean(anchorE8);
  const isClientPaymentsDropdownOpen = Boolean(anchorE9);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownOpen = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleRecDropdownOpen = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleAdminDropdownOpen = (event) => {
    setAnchorE4(event.currentTarget);
  };

  const handleAdminFeatureDropdownOpen = (event) => {
    setAnchorE5(event.currentTarget);
  };

  const handleAdminOrdersDropdownOpen = (event) => {
    window.location.assign("/team-orders");
  };

  const handleFreelancerMyjobsDropdownOpen = (event) => {
    setAnchorE7(event.currentTarget);
  };

  const handleClientOrdersDropdownOpen = (event) => {
    // setAnchorE8(event.currentTarget);
    window.location.assign("/team-orders");
  };

  const handleClientPaymentsDropdownOpen = (event) => {
    setAnchorE9(event.currentTarget);
  };

  const logOut = () => {
    logoutUser();
    localStorage.clear("filterData");
    // window.location.reload();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className=""
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        {accountType === 1 ? (
          <div className="mb-3">
            <NavLink
              to={"/all-jobs"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h6 onClick={handleMenuClose}>Dashboard </h6>
            </NavLink>
          </div>
        ) : accountType === 4 ? (
          <div className="mb-3">
            <a
              href={"/recruiter-all-jobs"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h6 onClick={handleMenuClose}>Dashboard </h6>
            </a>
          </div>
        ) : // )
        //   <div className="mb-3">
        //   </div>
        accountType === 3 ? (
          <div className="mb-3">
            <a
              href={"/admin-dashboard"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h6 onClick={handleMenuClose}>Dashboard </h6>
            </a>
          </div>
        ) : (
          ""
        )}
        <div className="mb-3">
          <a
            href={"/profile"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6
              onClick={() => {
                handleMenuClose();
                localStorage.removeItem("userId");
                localStorage.removeItem("fromCandi");
              }}
            >
              Profile
            </h6>
          </a>
        </div>
        <div className="mb-3">
          <a
            href={"/account-settings"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6 onClick={handleMenuClose}>Account Settings</h6>
          </a>
        </div>

        <div>
          <div style={{ cursor: "pointer" }}>
            <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h6 onClick={logOut}>Logout</h6>
            </a>
          </div>
        </div>
      </div>
    </Menu>
  );

  const dropdown = "s";
  const renderDropdown = (
    <Menu
      anchorEl={anchorE2}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      id={dropdown}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isDropdownOpen}
      onClose={handleDropdownClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className="menu-desktop"
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        <div className="mb-3">
          <div
            onClick={() => {
              handleClientJobs();
            }}
            style={{ cursor: "pointer" }}
          >
            <h6 onClick={handleDropdownClose}>All Jobs</h6>
          </div>
        </div>
        <div className="mb-3">
          <NavLink
            to={"#"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6 onClick={handleDropdownClose}>Current Jobs</h6>
          </NavLink>
        </div>
        <div className="mb-3">
          <NavLink
            to={"#"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6 onClick={handleDropdownClose}>Completed Jobs</h6>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={"#"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6 onClick={handleDropdownClose}>Drafts</h6>
          </NavLink>
        </div>
      </div>
    </Menu>
  );

  const recruiterdropdown = "t";
  const renderRecDropdown = (
    <Menu
      anchorEl={anchorE3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      id={recruiterdropdown}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isRecDropdownOpen}
      onClose={handleRecDropdownClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className="menu-desktop"
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        <div
          className="mb-3"
          onClick={() => {
            handleRecruiterJobs();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleRecDropdownClose}>All Jobs</h6>
        </div>
        <div className="mb-3">
          <NavLink
            to={"/applied-jobs"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6 onClick={handleRecDropdownClose}>Current Jobs</h6>
          </NavLink>
        </div>
        <div className="mb-3">
          <NavLink
            to={"/applied-jobs"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6 onClick={handleRecDropdownClose}>Completed Jobs</h6>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={"/applied-jobs"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h6 onClick={handleRecDropdownClose}>Drafts</h6>
          </NavLink>
        </div>
      </div>
    </Menu>
  );

  const admindropdown = "g";
  const renderAdminDropdown = (
    <Menu
      anchorEl={anchorE4}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      id={admindropdown}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isAdminDropdownOpen}
      onClose={handleAdminDropdownClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className="menu-desktop"
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        <div
          className="mb-3 admin-navbar-user-counter"
          onClick={() => {
            handleAdminFreelancers();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleAdminDropdownClose}>Freelancers</h6>
          {parseInt(newUser?.freelancerCount) > 0 && (
            <div className="admin-navbar-counter">
              +{newUser?.freelancerCount}
            </div>
          )}
        </div>

        <div
          className="mb-3 admin-navbar-user-counter"
          onClick={() => {
            handleAdminClients();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleAdminDropdownClose}>Clients</h6>
          {newUser?.clientCount * 1 > 0 && (
            <div className="admin-navbar-counter">+{newUser?.clientCount}</div>
          )}
        </div>

        <div
          className="admin-navbar-user-counter"
          onClick={() => {
            handleAdminRecruiters();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleMenuClose} className="admin-navbar-user-counter">
            Recruiters
          </h6>
          {newUser?.recruiterCount * 1 > 0 && (
            <div className="admin-navbar-counter">
              +{newUser?.recruiterCount}
            </div>
          )}
        </div>
      </div>
    </Menu>
  );

  const adminfeaturedropdown = "a";
  const renderAdminfeatureDropdown = (
    <Menu
      anchorEl={anchorE5}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      id={adminfeaturedropdown}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isAdminFeatureDropdownOpen}
      onClose={handleAdminFeatureDropdownClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className="menu-desktop"
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        <div
          className="mb-3"
          onClick={() => {
            handleGhanaCat();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleAdminFeatureDropdownClose}>Ghana Categories</h6>
        </div>

        <div
          className="mb-3"
          onClick={() => {
            handleFreelanceCat();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleAdminFeatureDropdownClose}>
            Freelance Categories
          </h6>
        </div>

        <div
          className="mb-3"
          onClick={() => {
            handleAddOns();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleAdminFeatureDropdownClose}>Project Tools</h6>
        </div>

        <div
          className=""
          onClick={() => {
            handlePaymentLevels();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleAdminFeatureDropdownClose}>Payment Levels</h6>
        </div>
      </div>
    </Menu>
  );

  const freelancermyjobsdropdown = "c";
  const renderFreelancerMyjobsDropdown = (
    <Menu
      anchorEl={anchorE7}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      id={freelancermyjobsdropdown}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isFreelancerMyjobsDropdownOpen}
      onClose={handleFreelancerMyjobsDropdownClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className="menu-desktop"
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        <div onClick={() => {}} style={{ cursor: "pointer" }}>
          <h6 onClick={handleAdminOrdersDropdownClose}>Applied Jobs </h6>
        </div>
      </div>
    </Menu>
  );

  const clientordersdropdown = "d";
  const renderClientOrdersDropdown = (
    <Menu
      anchorEl={anchorE8}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      id={clientordersdropdown}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isClientOrdersDropdownOpen}
      onClose={handleClientOrdersDropdownClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className="menu-desktop"
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        <div
          className="mb-3"
          onClick={() => {
            handleClientNewOrders();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleClientOrdersDropdownClose}>New Team</h6>
        </div>

        <div
          className="mb-3"
          onClick={() => {
            handleClientInprocess();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleClientOrdersDropdownClose}>In-process</h6>
        </div>

        <div
          className="mb-3"
          onClick={() => {
            handleClientCompleted();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleClientOrdersDropdownClose}>Completed</h6>
        </div>

        <div
          className="mb-3"
          onClick={() => {
            handleClientCancelled();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleClientOrdersDropdownClose}>Cancelled</h6>
        </div>

        <div
          onClick={() => {
            handleclickPaymentProcess();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleClientOrdersDropdownClose}>Payment Process</h6>
        </div>

        {/* <div
          onClick={() => {
            handleAdminJobs();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6>All Jobs</h6>
        </div> */}
      </div>
    </Menu>
  );

  const clientpaymentsdropdown = "p";
  const renderClientPaymentsDropdown = (
    <Menu
      anchorEl={anchorE9}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      id={clientpaymentsdropdown}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isClientPaymentsDropdownOpen}
      onClose={handleClientPaymentsDropdownClose}
      style={{ marginTop: "41px" }}
    >
      <div
        className="menu-desktop"
        style={{ cursor: "pointer", padding: "10px 10px 0px 10px" }}
      >
        <div
          className="mb-3"
          onClick={() => {
            handleClientPaymentDue();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleClientPaymentsDropdownClose}>Payments Due</h6>
        </div>

        <div
          className=""
          onClick={() => {
            handleClientInvoices();
          }}
          style={{ cursor: "pointer" }}
        >
          <h6 onClick={handleClientPaymentsDropdownClose}>
            Completed Payments
          </h6>
        </div>
      </div>
    </Menu>
  );

  const checkProfileCompletionForJobs = async () => {
    Api()
      .get(`/users/get-user-profile/${newId}`)
      .then((response) => {
        setProfileCheck(response.data.check);

        if (
          (!response.data.check && getUserType()?.accountTypeId === 1) ||
          (response.data.check !== true && getUserType()?.accountTypeId === 4)
        ) {
          setOpenProfilePrompt(true);
        } else {
          if (recruiterRole()) {
            window.location.assign("/all-jobs");
          } else {
            window.location.assign("/recruiter-all-jobs");
          }
        }
      })
      .catch((error) => {});
  };

  const fetchNewUser = async () => {
    Api()
      .get(`admin/all-new-users`)
      .then((response) => {
        setNewUser(response?.data);
      })
      .catch((error) => {});
  };

  const checkProfileCompletion = async () => {
    Api()
      .get(`/users/get-user-profile/${newId}`)
      .then((response) => {
        setProfileCheck(response.data.check);

        if (
          (!response.data.check && getUserType()?.accountTypeId === 1) ||
          (response.data.check !== true && getUserType()?.accountTypeId === 4)
        ) {
          setOpenProfilePrompt(true);
        } else {
          if (recruiterRole()) {
            handleclick();
          } else {
            handleclick1();
          }
        }
      })
      .catch((error) => {});
  };

  const checkProfileCompletion2 = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        if (response.data.check !== true) {
          setOpenProfilePrompt(true);
        } else {
          handleApplicants();
        }
      })
      .catch((error) => {});
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

  useEffect(() => {
    if(getUserType().accountTypeId === 3){
      fetchNewUser();
    }
    getLocation();
  }, [currrentLocation, location]);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar className="NewnavBar-login">
        <Toolbar className="newNavcontainer-login d-flex justify-content-between">
          <div className="d-flex mt-1 menuiconLogo">
            <IconButton
              edge="start"
              className="menuButton"
              color="primary"
              aria-label="open drawer"
              onClick={handleOpenSideNav}
            >
              <Icon
                path={mdiMenu}
                title="Menu"
                size={1.2}
                horizontal
                color="#2E405B"
                vertical
                rotate={180}
              />
            </IconButton>
            <div>
              {getUserType()?.accountTypeId === 1 ? (
                <div onClick={handleclickCandidatePool}>
                  <img
                    src={`${frontURL}/images/fw_logo.png`}
                    alt="logo"
                    className="recruiterBrand"
                  />
                </div>
              ) : getUserType()?.accountTypeId === 2 ? (
                <div onClick={handleclickSearchJobs}>
                  <img
                    src={`${frontURL}/images/fw_logo.png`}
                    alt="logo"
                    className="recruiterBrand"
                  />
                </div>
              ) : getUserType()?.accountTypeId === 4 ? (
                <div onClick={handleRecruiterJobs}>
                  <img
                    src={`${frontURL}/images/fw_logo.png`}
                    alt="logo"
                    className="recruiterBrand"
                  />
                </div>
              ) : (
                <NavLink to="/admin-dashboard">
                  <img
                    src={`${frontURL}/images/fw_logo.png`}
                    alt="logo"
                    className="recruiterBrand"
                  />
                </NavLink>
              )}
            </div>
          </div>
          <div className="DesktopMenu">
            <Tabs value={value} indicatorColor="primary" textColor="primary">
              {getUserType()?.accountTypeId === 3 ? (
                <Tab
                  className="navItems"
                  label="Dashboard "
                  onClick={() => {
                    handleclickAdminDashboard();
                  }}
                />
              ) : (
                ""
              )}

              {getUserType()?.accountTypeId === 3 ? (
                <span
                  aria-controls={admindropdown}
                  onClick={handleAdminDropdownOpen}
                >
                  <Tab
                    label={
                      <div>
                        <span
                          style={{
                            fontSize: "13px",
                            fontFamily: "Montserrat",
                            color: "#000000A8",
                          }}
                        >
                          Users
                        </span>
                        {newUser?.total * 1 > 0 && (
                          <span
                            style={{ marginRight: "20px" }}
                            className="admin-navbar-counter"
                          >
                            +{newUser?.total ? newUser.total : null}
                          </span>
                        )}
                      </div>
                    }
                    className={
                      window.location.pathname === "/user-freelancers" ||
                      window.location.pathname === "/user-clients" ||
                      window.location.pathname === "/user-recruiters"
                        ? "navItemsWithDropdownActive"
                        : "navItemsWithDropdownInactive"
                    }
                  />

                  <Icon
                    path={mdiChevronDown}
                    title="Users"
                    size={1}
                    horizontal
                    color="#2E405B"
                    vertical
                    rotate={180}
                    style={{
                      marginRight: "25px",
                      marginLeft: "-29px",
                      marginTop: "2px",
                    }}
                  />
                </span>
              ) : null}

              {getUserType()?.accountTypeId === 3 ? (
                <span
                  aria-controls={adminfeaturedropdown}
                  onClick={handleAdminFeatureDropdownOpen}
                >
                  <Tab
                    label="Platform Features "
                    className={
                      window.location.pathname === "/local-category" ||
                      window.location.pathname === "/platform-category" ||
                      window.location.pathname === "/project-tools" ||
                      window.location.pathname === "/paymentlevels"
                        ? "navItemsWithDropdownActive"
                        : "navItemsWithDropdownInactive"
                    }
                  />
                  <Icon
                    path={mdiChevronDown}
                    title="Patform Features"
                    size={1}
                    horizontal
                    color="#2E405B"
                    vertical
                    rotate={180}
                    style={{ marginLeft: "-10px", marginTop: "2px" }}
                  />
                </span>
              ) : null}

              {getUserType()?.accountTypeId === 3 ? (
                <Tab
                  className="navItems"
                  label="Team"
                  onClick={handleAdminOrdersDropdownOpen}
                />
              ) : null}

              {/* NEW MENU FOR USER ALL JOBS */}
              {getUserType()?.accountTypeId === 3 ? (
                <Tab
                  className="navItems"
                  label="All Jobs"
                  onClick={() => {
                    handleClickAdminAllJobs();
                  }}
                />
              ) : (
                ""
              )}

              {getUserType()?.accountTypeId === 3 ? (
                <Tab
                  className="navItems"
                  label="Pages"
                  onClick={() => {
                    handleClickAdminPages();
                  }}
                />
              ) : (
                ""
              )}

              {getUserType()?.accountTypeId === 1 ? (
                <Tab
                  className="navItems"
                  label="Candidate Pool"
                  onClick={() => {
                    handleclickCandidatePool();
                  }}
                />
              ) : null}

              {getUserType()?.accountTypeId === 2 ? (
                <Tab
                  className="navItems"
                  label="Search Jobs "
                  onClick={() => {
                    handleclickSearchJobs();
                  }}
                />
              ) : null}

              {getUserType()?.accountTypeId === 2 ? (
                <Tab
                  className="navItems"
                  label="Ghana Jobs"
                  onClick={() => {
                    handleclickGhanaJobs();
                  }}
                />
              ) : null}

              {getUserType()?.accountTypeId === 1 ? (
                <Tab
                  className="navItems navHover"
                  label="My Jobs "
                  onClick={checkProfileCompletionForJobs}
                />
              ) : getUserType()?.accountTypeId === 4 ? (
                <span
                  aria-controls={recruiterdropdown}
                  onClick={checkProfileCompletionForJobs}
                >
                  <Tab
                    className="navItems navHover"
                    label="My Jobs "
                    style={{ color: "#555555" }}
                  />
                </span>
              ) : null}

              {getUserType()?.accountTypeId === 1 ? (
                <Tab
                  className="navItems"
                  label="View Applicants  "
                  onClick={() => {
                    checkProfileCompletion2();
                  }}
                />
              ) : getUserType()?.accountTypeId === 4 ? (
                <Tab
                  className="navItems"
                  label="View Applicants "
                  onClick={checkProfileCompletion2}
                />
              ) : (
                ""
              )}

              {getUserType()?.accountTypeId === 1 ? (
                <Tab
                  className="navItems"
                  label="Team"
                  onClick={handleClientOrdersDropdownOpen}
                />
              ) : null}

              {/* Payment Tab Implementation */}
              {getUserType()?.accountTypeId === 1 ||
              getUserType()?.accountTypeId === 3 ? (
                <span
                  aria-controls={clientpaymentsdropdown}
                  onClick={handleClientPaymentsDropdownOpen}
                >
                  <Tab
                    label="Payments"
                    className={
                      window.location.pathname === "/all-payment-due" ||
                      window.location.pathname === "/all-invoices" ||
                      window.location.pathname === "/client-payment-due" ||
                      window.location.pathname === "/client-invoices"
                        ? "navItemsWithDropdownActive"
                        : "navItemsWithDropdownInactive"
                    }
                  />
                  <Icon
                    path={mdiChevronDown}
                    title="Payments"
                    size={1}
                    horizontal
                    color="#2E405B"
                    vertical
                    rotate={180}
                    style={{
                      marginRight: "12px",
                      marginLeft: "-14px",
                      marginTop: "2px",
                    }}
                  />
                </span>
              ) : null}
            </Tabs>
          </div>
          <div className="navBarBtn">
            {getUserType()?.accountTypeId === 1 ? (
              <>
                <Button
                  variant="contained"
                  className={cx(buttonClass)}
                  disabled={
                    getUserType()?.isLimited &&
                    getUserType()?.accountTypeId !== 4
                  }
                  onClick={() => {
                    checkProfileCompletion();
                  }}
                >
                  Post Job
                </Button>
                <Icon
                  path={mdiAccountTieOutline}
                  title="Post Job"
                  size={1}
                  horizontal
                  color="#2E405B"
                  vertical
                  rotate={180}
                  onClick={() => {
                    checkProfileCompletion();
                  }}
                  className="postJobBtnIpadPro"
                />
              </>
            ) : getUserType()?.accountTypeId === 4 ? (
              <>
                <Button
                  variant="contained"
                  className={cx(buttonClass)}
                  disabled={
                    getUserType()?.isLimited &&
                    getUserType()?.accountTypeId !== 4
                  }
                  onClick={() => {
                    checkProfileCompletion();
                  }}
                >
                  Post Job
                </Button>
                <Icon
                  path={mdiAccountTieOutline}
                  title="Post Job"
                  size={1}
                  horizontal
                  color="#2E405B"
                  vertical
                  rotate={180}
                  onClick={() => {
                    checkProfileCompletion();
                  }}
                  className="postJobBtnIpadPro"
                />
              </>
            ) : null}
            {accountType === 1 ? (
              <IconButton
                onClick={() => {
                  pushToteam();
                }}
                className="pt-3"
                color="default"
              >
                <Badge badgeContent={teamCount?.length} color="primary">
                  <Icon
                    path={mdiAccountGroupOutline}
                    title="team"
                    size={1}
                    horizontal
                    color="#2E405B"
                    vertical
                    rotate={180}
                  />
                </Badge>
              </IconButton>
            ) : null}

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="default"
              style={{ backgroundColor: "inherit" }}
            >
              <Avatar
                alt="Profile Image"
                src={profileImg}
                className="allJobsAvatar"
              />
              <p
                className="mt-3"
                style={{ fontSize: "14.5px", marginLeft: "5px" }}
              >
                {profileName}
              </p>
              <ArrowDropDownIcon />
            </IconButton>
          </div>
        </Toolbar>
        <div>
          <Dialog
            open={openSideNav}
            onClose={handleCloseSideNav}
            TransitionComponent={Transition}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            hideBackdrop
            className="dialogborder"
          >
            <DialogContent
              style={{
                position: "fixed",
                left: "0",
                top: "57px",
                height: "100%",
                width: "300px",
                backgroundColor: "#2E405B",
                color: "white",
                padding: "0",
              }}
            >
              <div>
                {getUserType()?.accountTypeId === 1 ? (
                  <div>
                    <Button
                      variant="contained"
                      disabled={
                        getUserType()?.isLimited &&
                        getUserType()?.accountTypeId !== 4
                      }
                      className={cx(buttonClass2)}
                      style={{
                        marginLeft: "15px",
                        color: "#2E405B",
                        width: "150px",
                      }}
                      onClick={checkProfileCompletion}
                    >
                      Post Job
                    </Button>
                  </div>
                ) : getUserType()?.accountTypeId === 4 ? (
                  <div>
                    <Button
                      variant="contained"
                      disabled={
                        getUserType()?.isLimited &&
                        getUserType()?.accountTypeId !== 4
                      }
                      className={cx(buttonClass2)}
                      style={{
                        marginLeft: "15px",
                        color: "#2E405B",
                        width: "150px",
                      }}
                      onClick={checkProfileCompletion}
                    >
                      Post Job
                    </Button>
                  </div>
                ) : null}
              </div>
              {getUserType()?.accountTypeId === 1 ? (
                <List style={{ width: "230px", color: "white" }}>
                  <a
                    href="/candidate-pool"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiAccountSearchOutline}
                        title="Candidate Pool"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>Candidate Pool</ListItemText>
                    </ListItem>
                  </a>

                  <a
                    href="/all-jobs"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem className="dashboardNavLink mb-3" button>
                      <Icon
                        path={mdiBriefcaseAccountOutline}
                        title="My Jobs"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        color="#c9c8c8"
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText
                        primary="My Jobs"
                        className="dashboardNavLink"
                      />
                    </ListItem>
                  </a>

                  <a
                    href="/applicants"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiAccountMultipleOutline}
                        title="View Applicants"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>View Applicants </ListItemText>
                    </ListItem>
                  </a>

                  <ListItem
                    className="dashboardNavLink mb-3"
                    button
                    onClick={handleOpenOrdersSubMenu}
                  >
                    <Icon
                      path={mdiShoppingOutline}
                      title="Team"
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color="#c9c8c8"
                      style={{ marginRight: "15px" }}
                    />
                    <ListItemText primary="Team" className="dashboardNavLink" />
                  </ListItem>

                  <ListItem
                    className="dashboardNavLink mb-3"
                    button
                    onClick={handleOpenPaymentsSubMenu}
                  >
                    <Icon
                      path={mdiCashMultiple}
                      title="Payments"
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color="#c9c8c8"
                      style={{ marginRight: "15px" }}
                    />
                    <ListItemText
                      primary="Payments"
                      className="dashboardNavLink"
                    />
                    {listPaymentsOpen ? (
                      <ExpandLess className="dashboardNavLink" />
                    ) : (
                      <ExpandMore className="dashboardNavLink" />
                    )}
                  </ListItem>
                  <Collapse in={listPaymentsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <a className="navLink" href="/client-payment-due">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Payments Due"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="/client-invoices">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Completed Payment"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                    </List>
                  </Collapse>
                </List>
              ) : getUserType()?.accountTypeId === 2 ? (
                <List style={{ width: "230px", color: "white" }}>
                  <a
                    href="/freelancer-all-jobs"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiBriefcaseSearchOutline}
                        title="Search Jobs"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>Search Jobs</ListItemText>
                    </ListItem>
                  </a>

                  <a
                    href="/local-jobs"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiBriefcaseVariantOutline}
                        title="Ghana Jobs"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>Ghana Jobs</ListItemText>
                    </ListItem>
                  </a>

                  <Collapse in={listOrdersOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <a className="navLink" href="#">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Applied Jobs"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                    </List>
                  </Collapse>
                </List>
              ) : getUserType()?.accountTypeId === 4 ? (
                <List style={{ width: "230px", color: "white" }}>
                  <ListItem
                    className="dashboardNavLink mb-3"
                    button
                    onClick={handleRecruiterJobs}
                  >
                    <Icon
                      path={mdiBriefcaseAccountOutline}
                      title="My Jobs"
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color="#c9c8c8"
                      style={{ marginRight: "15px" }}
                    />
                    <ListItemText
                      primary="My Jobs"
                      className="dashboardNavLink"
                    />
                  </ListItem>
                  <Collapse in={listOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <a className="navLink" href="/recruiter-all-jobs">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="All Jobs"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="#">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Current Jobs"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="#">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Completed Jobs"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="#">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Drafts"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                    </List>
                  </Collapse>

                  <a
                    href="/applicants"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiAccountSupervisorOutline}
                        title="Dashboard"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>View Applicants </ListItemText>
                    </ListItem>
                  </a>
                </List>
              ) : (
                /* Mobile SideNav */
                <List style={{ width: "230px", color: "white" }}>
                  <a
                    href="/admin-dashboard"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiMonitorDashboard}
                        title="Dashboard"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>Dashboard</ListItemText>
                    </ListItem>
                  </a>

                  <ListItem
                    className="dashboardNavLink mb-3"
                    button
                    onClick={handleOpenSubMenu}
                  >
                    <Icon
                      path={mdiAccountGroupOutline}
                      title="Users"
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color="#c9c8c8"
                      style={{ marginRight: "15px" }}
                    />
                    <ListItemText
                      primary={
                        <div>
                          <span>Users</span>
                          {newUser?.count * 1 > 0 && (
                            <span
                              style={{ marginRight: "20px" }}
                              className="admin-navbar-counter"
                            >
                              +{newUser?.count ? newUser.count : null}
                            </span>
                          )}
                        </div>
                      }
                      className="dashboardNavLink"
                    />
                    {listOpen ? (
                      <ExpandLess className="dashboardNavLink" />
                    ) : (
                      <ExpandMore className="dashboardNavLink" />
                    )}
                  </ListItem>
                  <Collapse in={listOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <a className="navLink" href="/user-freelancers">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary={
                              <div className="mb-3 admin-navbar-user-counter">
                                <span>Freelancers</span>
                                {newUser?.freelancerCount * 1 > 0 && (
                                  <div className="admin-navbar-counterMobile">
                                    +{newUser?.freelancerCount}
                                  </div>
                                )}
                              </div>
                            }
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                      <a className="navLink" href="user-clients">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary={
                              <div className="admin-navbar-user-counter">
                                <span>Clients</span>
                                {newUser?.clientCount * 1 > 0 && (
                                  <div className="admin-navbar-counterMobile">
                                    +{newUser?.clientCount}
                                  </div>
                                )}
                              </div>
                            }
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                      <a className="navLink" href="/user-recruiters">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary={
                              <div className="mb-3 admin-navbar-user-counter">
                                <span>Recruiters</span>
                                {newUser?.recruiterCount * 1 > 0 && (
                                  <div className="admin-navbar-counterMobile">
                                    +{newUser?.recruiterCount}
                                  </div>
                                )}
                              </div>
                            }
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                    </List>
                  </Collapse>

                  <ListItem
                    className="dashboardNavLink mb-3"
                    button
                    onClick={handleOpenFeaturesSubMenu}
                  >
                    <Icon
                      path={mdiViewDashboardOutline}
                      title="Platform Features "
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color="#c9c8c8"
                      style={{ marginRight: "15px" }}
                    />
                    <ListItemText
                      primary="Platform Features"
                      className="dashboardNavLink"
                    />
                    {listFeaturesOpen ? (
                      <ExpandLess className="dashboardNavLink" />
                    ) : (
                      <ExpandMore className="dashboardNavLink" />
                    )}
                  </ListItem>
                  <Collapse in={listFeaturesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <a className="navLink" href="/local-category">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Ghana Categories"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="/platform-category">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Freelance Categories"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="/project-tools">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Project Tools"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="/paymentlevels">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Payment Levels"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                    </List>
                  </Collapse>

                  <ListItem
                    className="dashboardNavLink mb-3"
                    button
                    onClick={handleOpenOrdersSubMenu}
                  >
                    <Icon
                      path={mdiShoppingOutline}
                      title="Team"
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color="#c9c8c8"
                      style={{ marginRight: "15px" }}
                    />
                    <ListItemText primary="Team" className="dashboardNavLink" />
                  </ListItem>

                  <a
                    href="/admin-all-jobs"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiFileDocumentMultipleOutline}
                        title="All Jobs"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>All jobs</ListItemText>
                    </ListItem>
                  </a>

                  <a
                    href="/admin-pages"
                    className="dashboardNavLink"
                    activeClassName="dashboardNavLink-active"
                  >
                    <ListItem button className="mb-3 dashboardNavLink">
                      <Icon
                        path={mdiBookOpenPageVariantOutline}
                        title="Pages"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        style={{ marginRight: "15px" }}
                      />
                      <ListItemText>Pages</ListItemText>
                    </ListItem>
                  </a>

                  <ListItem
                    className="dashboardNavLink mb-3"
                    button
                    onClick={handleOpenPaymentsSubMenu}
                  >
                    <Icon
                      path={mdiCashMultiple}
                      title="Payments"
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color="#c9c8c8"
                      style={{ marginRight: "15px" }}
                    />
                    <ListItemText
                      primary="Payments"
                      className="dashboardNavLink"
                    />
                    {listPaymentsOpen ? (
                      <ExpandLess className="dashboardNavLink" />
                    ) : (
                      <ExpandMore className="dashboardNavLink" />
                    )}
                  </ListItem>
                  <Collapse in={listPaymentsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <a className="navLink" href="/all-payment-due">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Payments Due"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>

                      <a className="navLink" href="/all-invoices">
                        <ListItem button className="dashboardNavLink">
                          <ListItemText
                            primary="Completed Payment"
                            style={{ color: "white", marginLeft: "40px" }}
                          />
                        </ListItem>
                      </a>
                    </List>
                  </Collapse>
                </List>
              )}
            </DialogContent>
          </Dialog>

          {/* DIALOG FOR CHECKING IF CLIENT HAS PROVIDED THE NECESSARY DETAILS */}
          <div>
            <Dialog
              open={openProfilePrompt}
              //disableBackdropClick
              fullWidth
              maxWidth="sm"
              className="dialogborder"
            >
              <DialogContent className="p-4 pt-5">
                <div className="text-center mb-4">
                  <h6>
                    <b>Update Your Profile</b>
                  </h6>
                </div>
                <div className="d-flex justify-content-center text-center mb-4">
                  {getUserType().accountTypeId === 1 ? (
                    <p>
                      Hello client, welcome to TheFairWork! To place an order
                      you will have to provide your name, phone number, country,
                      city and company details on your profile.
                    </p>
                  ) : (
                    <p>
                      Hello recruiter, welcome to TheFairWork! To place an order
                      you will have to provide your name,phone number,country
                      and city on your profile.
                    </p>
                  )}
                </div>
                <div className="d-flex justify-content-center mb-2">
                  <Button
                    variant="contained"
                    className="btn"
                    style={{ textTransform: "lowercase" }}
                    onClick={() => {
                      // localStorage?.remove("userId")
                      routeToProfile();
                    }}
                  >
                    Go to profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AppBar>
      {renderMenu}
      {renderDropdown}
      {renderRecDropdown}
      {renderAdminDropdown}
      {renderAdminfeatureDropdown}
      {renderFreelancerMyjobsDropdown}
      {renderClientOrdersDropdown}
      {renderClientPaymentsDropdown}

      <div className="container">{page}</div>

      <span className=" scrollTop" onClick={() => scrollToTop()}>
        <KeyboardArrowUpIcon fontSize="large" style={{ color: "white" }} />
      </span>
    </div>
  );
}

export default TopNavbar;
