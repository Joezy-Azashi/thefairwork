import React, { useState, useEffect } from "react";
import { Card, Button, TextField, Snackbar } from "@material-ui/core";
import { mdiFileDocumentOutline, mdiCloseCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { getCurrentUser } from "../../Services/auth";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";

import FileUploadService from "../../Services/fileUpload";

function ApplyJobsQuestions() {
  const [jobDetails, setJobDetails] = useState(
    JSON.parse(localStorage.getItem("jobDetails")) !== null
      ? JSON.parse(localStorage.getItem("jobDetails"))
      : []
  );

  const [fileUrl, setFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState([]);
  const [loading, setloading] = useState(false);
  const [uploadedFiles, setuploadedFiles] = useState([]);
  const [befUpload, setbefUpload] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [question, setQuestion] = useState([
    {
      ques: "",
      id: "",
    },
  ]);
  const [queAns, setqueAns] = useState([]);
  const [salary, setSlaray] = useState(jobDetails.salary);

  const [url, setUrl] = useState(
    salary ? "/local-job/apply-job" : "/jobs/apply-job"
  );

  const [showErrorText, setShowErrorText] = useState(false);

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const shoeSnack = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const clearFile = (file) => {
    let filesClear = befUpload.filter((item) => item !== file);
    setbefUpload(filesClear);
    setuploadedFiles(filesClear);
  };

  const uploadImage = (event) => {
    let fileList = event.target.files;

    Array.from(fileList).map((file) => {
      setbefUpload((prevArray) => {
        return [...prevArray, file.name];
      });
      if (file.size > 10000000) {
        setAlert({
          open: true,
          message: "File size can not be more than 10 MB",
          severity: "error",
        });
        setOpen(true);
      } else {
        setUploadFileName(event.target.files[0]);
        setloading(true);
        setFileLoading(true);
        let url = `/upload-file-form`;
        FileUploadService.uploadGeneral(event.target.files[0], url)
          .then((response) => {
            setFileUrl(response);
            setloading(false);
            setFileLoading(false);
            setuploadedFiles((prevArray) => {
              return [...prevArray, response];
            });
          })
          .catch((error) => {});
      }
    });
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

  const applyJob = async (e) => {
    e.preventDefault();
    const data = {
      jobId: jobDetails.id,
      userAccountId: getCurrentUser().user?.id,
      name: jobDetails?.name !== " " ? jobDetails?.name : `User`,
      email: jobDetails?.email,
      fileName: uploadedFiles,
      answers: queAns,
      jobTitle: jobDetails?.title,
    };

    Api()
      .post(`${url}`, data)
      .then((response) => {
        shoeSnack();
        setAlert({
          open: true,
          message: `${response.data.message}`,
          severity: "success",
        });
        closeAlert();
        setTimeout(() => {
          window.location.assign(
            salary ? `/local-jobs` : `/freelancer-all-jobs`
          );
        }, 2000);
      })
      .catch((error) => {
        shoeSnack();
        setAlert({
          open: true,
          message: `${error.response.data.message}`,
          severity: "error",
        });
        closeAlert();
      });
  };

  useEffect(() => {
    setQuestion(jobDetails.Questions);
  }, []);

  return (
    <div>
      <div className="d-flex">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          <Card
            className="mt-1 mb-5"
            style={{
              borderRadius: "3px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
              padding: "35px",
            }}
          >
            {jobDetails.title === undefined ? null : (
              <p className="bodyTitles">
                <b>{jobDetails?.title}</b>
              </p>
            )}
            <form onSubmit={applyJob}>
              {jobDetails?.Questions?.length <= 0 ? (
                ``
              ) : (
                <div>
                  <div className="mb-2 pt-2">
                    <p>
                      <b>Questions</b>
                    </p>
                  </div>
                </div>
              )}
              <div>
                {jobDetails?.Questions?.map((questions, index) => {
                  return (
                    <div key={(index, questions?.id)} className="mb-4 mt-4">
                      <div className="mb-2 pt-2">
                        <p>
                          {questions?.question}{" "}
                          {questions?.required === true ? `(Required)` : ``}
                        </p>
                      </div>
                      <TextField
                        id={questions.id}
                        placeholder="Please provide your answer"
                        label="Please provide your answer"
                        type="text"
                        variant="outlined"
                        className="cpFilterLabel"
                        multiline
                        required={questions.required}
                        asterisk
                        rows={2}
                        fullWidth
                        onChange={(e) => {
                          const answer = e.target.value;
                          let oldQuestions = queAns;
                          question.map((que) => {
                            if (que.id === questions.id) {
                              let singleQueAns = {
                                questionId: questions.id,
                                answer: "",
                              };
                              singleQueAns.answer = answer;
                              const oldQueValue = oldQuestions.find(
                                (questionId) =>
                                  questionId === singleQueAns.questionId
                              );
                              if (oldQueValue !== undefined) {
                                oldQueValue.answer = answer;
                              } else {
                              }
                              oldQuestions = oldQuestions.filter(
                                (item) =>
                                  item.questionId !== singleQueAns.questionId
                              );
                              oldQuestions.push(singleQueAns);
                            }
                          });
                          setqueAns(oldQuestions);
                        }}
                        helperText={
                          showErrorText &&
                          questions?.required &&
                          question.ques === "" ? (
                            <p className="error-text">
                              You need to answer all required question(s)
                            </p>
                          ) : (
                            ``
                          )
                        }
                      />
                    </div>
                  );
                })}
                <div className="pageTitle mb-4"></div>
                <div className="mb-2">
                  <p>Add Attachment(s)</p>
                </div>
                <hr style={{ margin: "0" }} />
                <div className="col-md-12 text-center mb-4">
                  <label
                    for="fileUpload"
                    className="uploadHelpText"
                    style={{ fontSize: "12px", cursor: "pointer" }}
                  >
                    Drag your files here or{" "}
                    <span style={{ color: "#0C4767", opacity: "70%" }}>
                      click here
                    </span>{" "}
                    click here to upload files
                  </label>
                  <label
                    for="fileUpload"
                    className="uploadHelpTextMobile text-center"
                  >
                    Tap here to upload files
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    variant="outlined"
                    size="small"
                    accept=".docx, .ppt, .pptx, .xlx, .xlxs, .doc, .pdf"
                    className="job-file-upload"
                    onChange={uploadImage}
                    multiple="allowMultiple"
                  />
                  {befUpload?.map((file) => {
                    return (
                      <div className="d-flex mt-1">
                        <Icon
                          path={mdiFileDocumentOutline}
                          title="File name"
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                          color="#707070"
                        />
                        <div className="row">
                          <p className="col-md-12 mt-1">{file}</p>
                        </div>
                        <Icon
                          path={mdiCloseCircleOutline}
                          title="Delete"
                          size={0.9}
                          horizontal
                          vertical
                          rotate={180}
                          color="red"
                          className="p-1 mt-1"
                          onClick={() => {
                            clearFile(file);
                          }}
                          style={{ marginLeft: "10px" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5 text-center">
                <Button
                  variant="contained"
                  className="apply-job-btn"
                  type="submit"
                  // onClick={() => {

                  // }}
                >
                  {loading && (
                    <div style={{ marginRight: "5px" }}>
                      <ClipLoader size={20} color="#1b98e0" loading />
                    </div>
                  )}
                  {loading ? `Uploading File(s)` : `Apply Now`}
                </Button>
              </div>
            </form>
          </Card>
        </div>
        <div className="col-md-1"></div>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
        </Snackbar>
      </div>
    </div>
  );
}
export default ApplyJobsQuestions;
