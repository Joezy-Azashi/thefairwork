import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Card, CardContent, Button, Dialog } from "@material-ui/core";
import AddPortfolio from "../../Components/Portfolio/AddEditPortfolio";
import DeletePortfolio from "../../Components/Portfolio/DeletePortfolio";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { mdiSquareEditOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPortfolio } from "../../Services/redux/portfolio/index";
import { portReducer } from "../../Services/redux/portfolio/port_slice";
import Visibility from "@material-ui/icons/Visibility";

function ProfilePortfolio() {
  const dispatch = useDispatch();
  const portfolios = useSelector(portReducer);
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [openPortfolio, setOpePortfolio] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [portfolio, setportfolio] = useState([]);
  const [portfolioToPass, setportfolioToPass] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userAccount, setUserAccount] = useState("");

  const [selected, setSelected] = useState([]);
  // HOOKS TO TOGGLE BETWEEN ADD AND EDIT MODE
  const [editMode, seteditMode] = useState(false);

  const [numPages, setNumPages] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleOpenPortfolio = () => {
    setOpePortfolio(true);
    seteditMode(false);
    setportfolioToPass({});
  };

  const handleClose = () => {
    setOpePortfolio(false);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  //function to get user portfolio information
  const getPortfolio = async () => {
    await dispatch(getUserPortfolio(userAccountId))
      .then((response) => {
        setIsReady(true);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getPortfolio();
  }, []);

  return (
    <div>
      <Card className="mb-5 pb-4">
        <CardContent className="p-5 pb-5">
          <div className="">
            <p className="profile-headings">
              <b>Portfolio</b>
            </p>
          </div>
          <hr />
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : portfolios?.data?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>Add screenshots, Pdfs and/or links to projects you have worked on</p>
            </div>
          ) : (
            <div className="row portfolio-list mb-5">
              {portfolios?.data?.map((port, index) => {
                return (
                  <>
                    <div key={index} className="col-md-2 mb-3 mt-2">
                      <div style={{ width: "130px", margin: "auto" }}>
                        <div>
                          <div className="file">
                            <div className="content">
                              <div className="row" align="center">
                                <div className="col-md-12">
                                  {port.ext[0] === "xlsx" ||
                                  port.ext[0] === "xls" ||
                                  port.ext[0] === "csv" ? (
                                    <img
                                      src="/images/new-excel.png"
                                      width={90}
                                      height={100}
                                    />
                                  ) : port.ext[0] === "docs" ||
                                    port.ext[0] === "docx" ? (
                                    <img
                                      src="/images/msword.png"
                                      width={90}
                                      height={100}
                                    />
                                  ) : port.ext[0] === "pdf" ? (
                                    <div>
                                      <img
                                        src="/images/pdf.png"
                                        width={90}
                                        height={100}
                                      />
                                    </div>
                                  ) : port.ext[0] === "ppt" ||
                                    port.ext[0] === "pptx" ? (
                                    <img
                                      src="/images/ppt.png"
                                      width={90}
                                      height={100}
                                    />
                                  ) : port.ext[0] === "jpeg" ||
                                    port.ext[0] === "jpg" ||
                                    port.ext[0] === "png" ||
                                    port.ext[0] === "jfif" ? (
                                    <img
                                      src={port.file}
                                      width={120}
                                      height={100}
                                      style={{ borderRadius: "5px" }}
                                    />
                                  ) : port.ext[0] === "psd" ? (
                                    <img
                                      src="/images/new-psd.png"
                                      width={90}
                                      height={100}
                                    />
                                  ) : port.ext[0] === "xd" ? (
                                    <img
                                      src="/images/new-xd.png"
                                      width={90}
                                      height={100}
                                    />
                                  ) : port.ext[0] === "fig" ? (
                                    <img
                                      src="/images/new-fig.jpg"
                                      width={90}
                                      height={100}
                                    />
                                  ) : port.ext[0] === "mp4" ? (
                                    <div>
                                      <video
                                        width={140}
                                        height={100}
                                        controls
                                        style={{ borderRadius: "5px" }}
                                      >
                                        <source
                                          src={port.file}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    </div>
                                  ) : (
                                    <img
                                      src="/images/default-file.png"
                                      width={90}
                                      height={100}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex hoverButtons">
                              <div title="Edit">
                                <Icon
                                  path={mdiSquareEditOutline}
                                  title="Edit"
                                  size={1}
                                  horizontal
                                  vertical
                                  rotate={180}
                                  type="button"
                                  onClick={() => {
                                    seteditMode(true);
                                    setOpePortfolio(true);
                                    setportfolioToPass(port);
                                  }}
                                />
                              </div>
                              <div title="Delete">
                                <DeleteOutlineIcon
                                  color="secondary"
                                  type="button"
                                  onClick={() => {
                                    openDeleteDia();
                                    setDeleteId(port?.id);
                                    setUserAccount(userAccountId);
                                  }}
                                />
                              </div>
                              <div title="View Document">
                                <a href={port.file[0]} target="_blank" download>
                                  <Visibility
                                    color="primary"
                                    type="button"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="portFileName text-center mb-0 mt-2">
                        {port.title}
                      </p>
                    </div>
                  </>
                );
              })}
            </div>
          )}

          <div className="row justify-content-center mt-5 mb-3">
            <div className="col-md-12">
              <Button
                style={{color: "#2E405B"}}
                className="btn-text"
                onClick={handleOpenPortfolio}
                startIcon={<AddIcon />}
              >
                Add Portfolio
              </Button>
            </div>
          </div>
        </CardContent>
        <Dialog
          open={openDeleteDialog}
          onClose={closeDeleteDia}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <DeletePortfolio
            deleteId={deleteId}
            closeDeleteDia={closeDeleteDia}
            userAccount={userAccount}
          />
        </Dialog>
        <Dialog
          open={openPortfolio}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="sm"
          className="dialogborder"
        >
          <AddPortfolio
            profileId={profileId}
            portfolioToPass={portfolioToPass}
            editMode={editMode}
            handleClose={handleClose}
          />
        </Dialog>
      </Card>
    </div>
  );
}

export default ProfilePortfolio;
