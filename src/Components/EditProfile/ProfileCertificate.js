import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Card, CardContent, Button, Dialog } from "@material-ui/core";
import AddEditCertification from "../../Components/Certification/AddEditCertification";
import Api from "../../Services/api";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";
import DeleteCertification from "../../Components/Certification/DeleteCertification";
import Icon from "@mdi/react";
import { mdiSquareEditOutline, mdiDeleteOutline } from "@mdi/js";
import {getUserCertification} from "../../Services/redux/certification/index"
import {certReducer} from "../../Services/redux/certification/cert_slice"
import { useDispatch, useSelector } from "react-redux";


function ProfileCertificate() {
  const dispatch = useDispatch();
  const certificate = useSelector(certReducer);
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [openAddEditCertification, setOpenAddEditCertification] =
    useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [certificationData, setCertificationData] = useState([]);
  const [certificationToPass, setCertificationToPass] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [userAccount, setUserAccount] = useState("")

  // HOOKS TO TOGGLE BETWEEN ADD AND EDIT MODE
  const [editMode, seteditMode] = useState(false);

  const handleOpenAddEditEducation = () => {
    setOpenAddEditCertification(true);
    seteditMode(false);
    setCertificationToPass({});
  };

  const handleClose = () => {
    setOpenAddEditCertification(false);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

    //function to get user experience information
    const getCertificate = async () => {
      await dispatch(getUserCertification(userAccountId))
        .then((response) => {
          setIsReady(true)
        })
        .catch((error) => {
        });
    };

  const getUserCert = async () => {
    Api()
      .get(`/users/get-user-certification/${userAccountId}`)
      .then((response) => {
        setIsReady(true);
        setCertificationData(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    // getUserCert();
    getCertificate()
  }, []);

  return (
    <div>
      <Card className="mb-5 pb-4">
        <CardContent className="p-5 pb-5">
          <div className="">
            <p className="profile-headings">
              <b>Certification</b>
            </p>
          </div>
          <hr />
          {!certificate?.loaded ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : certificate?.data?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No certification has been added yet</p>
            </div>
          ) : (
            certificate?.data?.map((cert, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-md-10">
                      <div className="skillSet">
                      <p className="profile-headings mobileSpace">
                          <b>{cert?.certificate}</b>
                        </p>
                        <p className="exdivider">-</p>
                        <p className="profile-headings mobileSpace">
                          <b>{cert?.issuing_authority}</b>
                        </p>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <p className="profileResEdit mobileSpace">
                          <span className="eduPeriod" style={{display: "none"}}>From: </span> {moment(`${cert?.issue_date}`).format(
                              "Do MMMM YYYY"
                            )}
                          </p>
                          <p className="divider profileResEdit">-</p>
                          {cert?.valid_till == null ? (
                            <p className="mobileSpace profileResEdit"> <span className="eduPeriod" style={{display: "none"}}>To: </span> No Expiration Date </p>
                          ) : (
                            <p className="profileResEdit mobileSpace">
                             <span className="eduPeriod" style={{display: "none"}}>To: </span> {moment(`${cert?.valid_till}`).format(
                                "Do MMMM YYYY"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">{cert?.link}</div>
                  </div>
                  <div className="col-12 col-md-12 d-flex editDelete">
                      <div>
                        <Icon
                          path={mdiSquareEditOutline}
                          title="Edit"
                          size={1}
                          color="#2E405B"
                          horizontal
                          vertical
                          rotate={180}
                          type="button"
                          onClick={() => {
                            seteditMode(true);
                            setCertificationToPass(cert);
                            setOpenAddEditCertification(true);
                          }}
                        />
                      </div>
                      <div>
                        <Icon
                          path={mdiDeleteOutline}
                          title="Delete"
                          size={1}
                          horizontal
                          vertical
                          color="#F70000"
                          rotate={180}
                          type="button"
                          onClick={() => {
                            openDeleteDia();
                            setDeleteId(cert?.id);
                            setUserAccount(cert?.userAccountId)
                          }}
                        />
                      </div>
                    </div>
                  <hr className="mt-1"/>
                </>
              );
            })
          )}

          <div className="row justify-content-center mt-5 mb-3">
            <div className="col-md-12">
              <Button
              style={{color: "#2E405B"}}
                className="btn-text"
                onClick={handleOpenAddEditEducation}
                startIcon={<AddIcon />}
              >
                Add Certification
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
          <DeleteCertification
            deleteId={deleteId}
            closeDeleteDia={closeDeleteDia}
            userAccount={userAccount}
          />
        </Dialog>
        <Dialog
          open={openAddEditCertification}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="sm"
          className="dialogborder"
        >
          <AddEditCertification
            editMode={editMode}
            certificationToPass={certificationToPass}
            profileId={profileId}
            handleClose={handleClose}
          />
        </Dialog>
      </Card>
    </div>
  );
}

export default ProfileCertificate;
