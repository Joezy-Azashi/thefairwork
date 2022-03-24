import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  Checkbox,
  DialogActions,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import Icon from "@mdi/react";
import {
  mdiSquareEditOutline,
  mdiDeleteOutline,
  mdiMessageQuestionOutline,
} from "@mdi/js";
import Api from "../../Services/api";
import { questionReducer } from "../../Services/redux/jobQuestions/question_slice";
import { useDispatch, useSelector } from "react-redux";
import {
  postQuestions,fecthJobQuestions,
} from "../../Services/redux/jobQuestions/index";
import { v4 as uuidv4 } from "uuid";
import { getUserType } from "../../Services/auth";
import { ClipLoader } from "react-spinners";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function EditQuestion({editQuestionTag, jobData}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const questions = useSelector(questionReducer);
  const [question, setQuestion] = useState("");
  const [required, setRequired] = useState(false);
  const [editRquired, seteditRquired] = useState("");
  const [getQuestion, setstate] = useState([]);
  const [userAccountType, setuserAccountType] = useState(
    getUserType().accountTypeId
  );
  const [deleteQue, setQeleteQue] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setloading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editQues, setEditQues] = useState("");
  const [editQuestionsData, seteditQuestionsData] = useState([])

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeAlert = () => {
    setTimeout(() => {
      setAlert({
        open: false,
        message: "",
        severity: "",
      });
    }, 4000);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const closeDialog = () => {
    closeDeleteDia();
  };

  const showEditBox = () => {
    setQuestion({})
    setEditMode(true);
  };

  // localStorage.setItem('quesionUUId', uuidv4())
  const getQuestionUuid = localStorage.getItem("quesionUUId");

  const handleChange = (event) => {
    setRequired(event.target.checked);
  };

  const editHandleChanges = (event) => {
    seteditRquired(event.target.checked);
  };

  if ( editQuestionTag === null || editQuestionTag === "" || getQuestionUuid === "" || getQuestionUuid === null ) {
    localStorage.setItem("quesionUUId", uuidv4());
  }

  // API REQUEST TO EDIT QUESTION
  const editQuestion = async(e) => {
    e.preventDefault()
    const data = {
      id: editQues?.id,
      question: editQues?.question,
      required: editRquired,
    };

    Api()
      .put("/jobs/edit-question", data)
      .then(async (response) => {
        await dispatch(fecthJobQuestions(getQuestionUuid))
          .then((response) => {
            setstate(response?.payload?.data);
            setloading(false);
            closeDialog();
          })
          .catch((error) => {});
      })
      .catch((error) => {});
      setEditQues("")
  };

  // API REQUEST TO DELETE QUESTIONS RELATING TO A JOB
  const deleteJobQuestion = () => {
    const data = {
      questionId: [deleteQue.id],
    };

    setloading(true);
    Api()
      .delete("/jobs/delete-question", { data })
      .then(async (response) => {
        await dispatch(fecthJobQuestions(editQuestionTag ? editQuestionTag : getQuestionUuid))
          .then((response) => {
            setstate(response?.payload?.data);
            setloading(false);
            closeDialog();
          })
          .catch((error) => {});
      })
      .catch((error) => {
        setloading(false);
      });
  };

  // API REQUEST TO ADD QUESTIONS TO JOB
  const addQuestion = async (e) => {
    e.preventDefault();
    const data = {
      question: question,
      tag: editQuestionTag ? editQuestionTag : getQuestionUuid,
      required,
      account_type: userAccountType,
    };

    if( question === ""){
      setAlert({
        message:"Question field can not be empty.",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    }else{
      await dispatch(postQuestions(data))
      .then(async (response) => {
        await dispatch(fecthJobQuestions(editQuestionTag ? editQuestionTag : getQuestionUuid))
          .then((response) => {
          })
          .catch((error) => {});
      })
      .catch((error) => {});
    setQuestion("");
    }

  };

  const questionsFetch = async () => {
    await dispatch(fecthJobQuestions(editQuestionTag))
    .then((response) => {
      seteditQuestionsData(response?.payload?.data)
    }).catch((error) => {

    })
  }

  useEffect(() => {
    questionsFetch()
  }, [])


  return (
    <div>
      {questions?.data?.length > 4 ? null : !editMode ? (
        <Accordion style={{ boxShadow: "none" }}>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <div class="d-flex justify-content-start">
              <p className="btn-text">Ask your question</p>
            </div>
           
          </AccordionSummary>
          
          <form onSubmit={addQuestion}>
            <div className="row">
            <p style={{color:"red"}}>{alert.message}</p>
              <div className="col-md-12">
                <TextField
                  id="question"
                  required
                  asterisk
                  type="text"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={question}
                  fullWidth
                  onChange={(e) => setQuestion(e.target.value)}
                  inputProps={{
                    maxLength: 255,
                  }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <Checkbox
                  inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                  className="p-0"
                  onChange={handleChange}
                />
                <label className="mt-3" style={{ color: "#2E405B" }}>
                  Set as required
                </label>
              </div>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={addQuestion}
                >
                  Add question
                </Button>
              </DialogActions>
            </div>
          </form>
        </Accordion>
      ) : editMode ? (
        <Accordion style={{ boxShadow: "none" }}>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <div class="d-flex justify-content-start">
              <p className="btn-text">Ask your question</p>
            </div>
          </AccordionSummary>
          <form onSubmit={editQuestion}>
            <div className="row">
              <div className="col-md-12">
                <TextField
                  id="question1"
                  required
                  asterisk
                  type="text"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={editQues?.question}
                  fullWidth
                  onChange={(e) => setEditQues(e.target.value)}
                  inputProps={{
                    maxLength: 255,
                  }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <Checkbox
                  inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                  className="p-0"
                  onChange={editHandleChanges}
                />
                <label className="mt-3" style={{ color: "#2E405B" }}>
                  Set as required
                </label>
              </div>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={editQuestion}
                >
                  Edit question
                </Button>
              </DialogActions>
            </div>
          </form>
        </Accordion>
      ) : null}
      <div className="row">
        {questions?.data?.length <= 0
          ? null
          : questions?.data?.map((que) => {
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
                          showEditBox();
                          setEditQues(que);
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
                          openDeleteDia();
                          setQeleteQue(que);
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
              <Button variant="outlined" className="btn w-100" onClick={closeDialog}>
                No
              </Button>
            </div>
            <div className="col-md-6" align="left">
              <Button
                variant="outlined"
                className="w-100"
                type="submit"
                onClick={deleteJobQuestion}
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
  );
}

export default EditQuestion;
