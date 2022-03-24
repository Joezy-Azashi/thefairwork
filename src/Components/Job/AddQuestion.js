import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  Snackbar,
  Dialog,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import Icon from "@mdi/react";
import {
  mdiSquareEditOutline,
  mdiDeleteOutline,
  mdiMessageQuestionOutline,
} from "@mdi/js";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import Api from "../../Services/api";
import { v4 as uuidv4 } from "uuid";
import { ClipLoader } from "react-spinners";
import { getUserType } from "../../Services/auth";

function AddQuestion({ jobDataQuestions, jobData }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setloading] = useState(false);

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setOpen(false);
  };

  //new implementation
  const [allQuestions, setallQuestions] = useState(
    jobDataQuestions ? jobDataQuestions : []
  );
  const [selectedQuestion, setselectedQuestion] = useState("");
  const [questionChecked, setquestionChecked] = useState(false);
  const [selectedTag, setselectedTag] = useState("");
  const [editMode, seteditMode] = useState(false);
  const [questionId, setquestionId] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [deleteEditId, setDeleteEditId] = useState("");
  const [clientUrl, setClientUrl] = useState("/jobs/delete-question");
  const [recruiterUrl, setRecruiterUrl] = useState(
    "/local-job/delete-question"
  );
  const [userType, setUserType] = useState(getUserType()?.accountTypeId);

  const addToAllQuestions = () => {
    if (selectedQuestion === "") {
      setAlert({
        open: true,
        message: "Question field can not be empty.",
        severity: "error",
      });
      setOpen(true);
    } else {
      const tempQuestionObj = {
        question: selectedQuestion,
        tag: uuidv4(),
        required: questionChecked,
      };

      setallQuestions((prevArray) => {
        return [...prevArray, tempQuestionObj];
      });
      setselectedQuestion("");
      setquestionId(null);
      setquestionChecked(false);
    }
  };

  localStorage.setItem("allQuestions", JSON.stringify(allQuestions));

  const deleteFromAllQuestions = () => {
    setallQuestions(allQuestions.filter((item) => item.tag !== selectedTag));
    setselectedTag("");
    setOpenDeleteDialog(false);
  };

  const selectQuestionToEdit = (question) => {
    setselectedQuestion(question.question);
    setselectedTag(question.tag);
    setquestionChecked(question.required);
    if (jobDataQuestions) setquestionId(question.id);
    seteditMode(true);
    setExpanded(true);
  };

  const replaceQuestion = () => {
    if (selectedQuestion === "") {
      setAlert({
        open: true,
        message: "Question field can not be empty.",
        severity: "error",
      });
      setOpen(true);
    }
    let allQuestioinsClone = allQuestions.filter(
      (item) => item.tag !== selectedTag
    );

    const tempQuestionObj = {
      question: selectedQuestion,
      tag: selectedTag,
      required: questionChecked,
    };
    if (jobDataQuestions) {
      tempQuestionObj.id = questionId;
    }
    allQuestioinsClone.push(tempQuestionObj);
    setallQuestions(allQuestioinsClone);
    setselectedQuestion("");
    setquestionChecked(false);
    setselectedTag("");
    setquestionId(null);
    seteditMode(false);
  };

  // API REQUEST TO DELETE QUESTIONS RELATING TO A JOB IN EDIT MODE
  const deleteJobQuestion = () => {
    let allQuestioinsClone = allQuestions.filter(
      (item) => item.tag !== selectedTag
    );
    const data = {
      questionId: [deleteEditId],
    };
    setloading(true);
    Api()
      .delete(userType === 1 ? clientUrl : recruiterUrl, { data })
      .then(async (response) => {
        setOpenDeleteDialog(false);
        setallQuestions(allQuestioinsClone);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
      });
  };

  const openDeleteDia = (tag) => {
    setselectedTag(tag);
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const closeDialog = () => {
    closeDeleteDia();
  };

  const handleChange = (event) => {
    setquestionChecked(!questionChecked);
  };

  return (
    <>
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            severity={`${alert.severity}`}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlert({
                    open: false,
                    message: "",
                    severity: "",
                  });
                }}
              >
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </div>
      <div>
        {allQuestions?.length < 5 || editMode ? (
          <Accordion style={{ boxShadow: "none" }} expanded={expanded}>
            <AccordionSummary className="p-0">
              <p
                className="btn-text mr-4"
                style={{ marginTop: "-25px" }}
                onClick={() => {
                  setExpanded(!expanded);
                }}
              >
                Ask your question
              </p>
            </AccordionSummary>

            <form onSubmit={addToAllQuestions}>
              <div className="row" style={{ marginTop: "-25px" }}>
                <div className="col-md-12">
                  <TextField
                    id="askquestion"
                    required
                    asterisk
                    type="text"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={selectedQuestion}
                    fullWidth
                    onChange={(e) => setselectedQuestion(e.target.value)}
                    inputProps={{
                      maxLength: 255,
                    }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <div className="d-flex mt-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={questionChecked}
                    onChange={handleChange}
                    color="#2E405B"
                    style={{color: "#2E405B"}}
                  />
                  <p
                    className=""
                    style={{
                      color: "#2E405B",
                      fontFamily: "Segoe UI,sans-serif",
                      marginLeft: "6px",
                    }}
                  >
                    Set as required
                  </p>
                </div>
                <div>
                  <Button
                    variant="outlined"
                    style={{ color: "#2E405B", border: "1px solid #2E405B" }}
                    onClick={editMode ? replaceQuestion : addToAllQuestions}
                  >
                    {editMode ? "Update Question" : "Add Question"}
                  </Button>
                </div>
              </div>
            </form>
          </Accordion>
        ) : (
          ""
        )}
        <div className="row">
          {allQuestions?.length <= 0
            ? null
            : allQuestions?.map((que) => {
                return (
                  <>
                    <div className="d-flex bd-highlight">
                      <div className=" flex-grow-1 bd-highlight mb-3">
                        <Icon
                          path={mdiMessageQuestionOutline}
                          size={1}
                          horizontal
                          vertical
                          color="#2E405B"
                          rotate={180}
                        />{" "}
                        <span>{que.question}</span>
                      </div>
                      <div className=" bd-highlight">
                        <Icon
                          path={mdiSquareEditOutline}
                          size={1}
                          horizontal
                          vertical
                          color="#2E405B"
                          rotate={180}
                          onClick={() => {
                            selectQuestionToEdit(que);
                          }}
                        />
                      </div>
                      <div className=" bd-highlight">
                        <Icon
                          path={mdiDeleteOutline}
                          size={1}
                          horizontal
                          vertical
                          color="red"
                          rotate={180}
                          onClick={() => {
                            openDeleteDia(que.tag);
                            setDeleteEditId(que.id);
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
        </div>

        {/* // CONTENT FOR DELETE QUESTION DIALOG STARTS FROM HERE */}
        <Dialog
          open={openDeleteDialog}
          onClose={closeDeleteDia}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <DialogContent className="text-center">
            <p>Are you sure you want to delete this record?</p>

            <div className="row justify-content-center text-center">
              <div className="col-md-6 mb-2" align="right">
                <Button
                  variant="outlined"
                  className="btn w-100"
                  onClick={closeDialog}
                >
                  No
                </Button>
              </div>
              <div className="col-md-6" align="left">
                <Button
                  variant="outlined"
                  className="w-100"
                  type="submit"
                  onClick={() => {
                    jobData ? deleteJobQuestion() : deleteFromAllQuestions();
                  }}
                >
                  {loading && (
                    <div style={{ marginRight: "5px" }}>
                      <ClipLoader size={20} color="#1b98e0" loading />
                    </div>
                  )}
                  Yes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* // CONTENT FOR DELETE QUESTION DIALOG ENDS HERE */}
      </div>
    </>
  );
}

export default AddQuestion;
