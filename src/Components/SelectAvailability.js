import React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Icon from "@mdi/react";
import { mdiCircle } from "@mdi/js";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const options = [
  { title: "Available", value: "available" },
  { title: "Not Available", value: "not available" },
  { title: "Hired", value: "hired" },
];

const SelectAvailability = (props) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleMenuItemClick = (value) => {
    if (value !== props.freelancer.availability) {
      props.handleAvailabilty(value, props.freelancer.id);
    }
    return setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        onClick={handleToggle}
        variant=""
        ref={anchorRef}
        aria-label="button"
        style={{ boxShadow: "none", backgroundColor: "#E9E9EE" }}
      >
        <Button
          size="small"
          style={{
            width: "130px",
            padding: "5px 7px",
            backgroundColor: "#E9E9EE",
            color: "rgba(0,0,0,0.87)",
            textTransform: "capitalize",
            fontSize: "14px",
            fontFamily: '"Segoe UI"',
            lineHeight: "20.02px",
            fontWeight: "400",
            textAlign: "left",
          }}
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
        >
          <Icon
            path={mdiCircle}
            size={0.5}
            color={
              props.freelancer.availability === "available"
                ? "#009E20"
                : props.freelancer.availability === "not available"
                ? "#E90000"
                : "#FFBF00"
            }
            style={{ marginRight: "0.7rem" }}
          />
          {props.freelancer.availability}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          style={{ color: "", width: "5px", backgroundColor: "#E9E9EE" }}
        >
          <KeyboardArrowDownIcon style={{ color: "#2E405B" }} />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: "1" }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper style={{ width: "170px" }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === props.freelancer.availability}
                      value={props.freelancer.availability}
                      onClick={(event) => {
                        return handleMenuItemClick(option.value);
                      }}
                      style={{ fontSize: "14px", fontFamily: '"Segoe UI"' }}
                    >
                      <Icon
                        path={mdiCircle}
                        size={0.5}
                        color={
                          option.value === "available"
                            ? "#009E20"
                            : option.value === "not available"
                            ? "#E90000"
                            : "#FFBF00"
                        }
                        style={{ marginRight: "10px" }}
                      />
                      {option.title}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default SelectAvailability;
