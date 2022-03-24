import React, { useEffect, useRef, useState } from "react";
import { Button, MenuList, Paper, Grow, Popper } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce/tinymce";
import Api from "../Services/api";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLocation } from "react-router";
import { ClipLoader } from "react-spinners";

function AddAdminPages() {
  const location = useLocation();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [title, setTitle] = useState(
    localStorage.getItem("parentData")
      ? JSON.parse(localStorage.getItem("parentData"))
      : ""
  );
  const [content, setContent] = useState(
    localStorage.getItem("parentData")
      ? JSON.parse(localStorage.getItem("parentData"))
      : ""
  );
  const [parentPage, setParentPage] = useState([]);
  const [id, setId] = useState(
    localStorage.getItem("parentData")
      ? JSON.parse(localStorage.getItem("parentData"))
      : ``
  );
  const [selectedParentTitle, setSelectedParentTitle] = useState(
    localStorage.getItem("parentData")
      ? JSON.parse(localStorage.getItem("parentData"))
      : ``
  );
  const [selectedParentId, setselectedParentId] = useState(
    localStorage.getItem("parentData")
      ? JSON.parse(localStorage.getItem("parentData"))
      : null
  );
  const [editMode, setEditMode] = useState(location?.state?.params);
  const [parentid, setParentid] = useState();
  const [parentValue, setparentValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadEditor, setLoadEditor] = useState(true);

  const handleMenuItemClick = (parentTitle, index) => {
    setSelectedParentTitle(parentTitle?.title);
    setparentValue(parentTitle?.title);
    setselectedParentId(parentTitle?.id);
    setParentid(parentTitle);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClosebtn = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const closeAlert = () => {
    setTimeout(() => {
      setOpen1(false);
    }, 4000);
  };

  const Category = async () => {
    Api()
      .get("/pages/parents")
      .then((response) => {
        setParentPage(response?.data);
        setparentValue(
          response.data.find((item) => item.id === selectedParentTitle.parentId)
            .title
        );
      })
      .catch((error) => {});
  };

  const editAdminPage = async () => {
    setLoading(true);
    const data = {
      title: title?.title !== undefined ? title?.title : title,
      content: content?.content !== undefined ? content?.content : content,
      parentId:
        parentid?.parentId === null
          ? parentid?.id
          : parentid?.parentId === undefined
          ? null
          : parentid?.parentId,
    };

    Api()
      .put(`/pages/${id.id}`, data)
      .then((response) => {
        setLoading(false);
        window.location.assign("/admin-pages");
        localStorage.clear("parentData");
      })
      .catch((error) => {
        setOpen1(true);
        closeAlert();
      });
  };

  const addAdminPage = async () => {
    setLoading(true);
    const data = {
      title: title,
      content: content,
      parentId: selectedParentId,
    };

    Api()
      .post("/pages/create-page", data)
      .then((response) => {
        setLoading(false);
        window.location.assign("/admin-pages");
      })
      .catch((error) => {
        setOpen1(true);
        closeAlert();
      });
  };

  useEffect(() => {
    Category();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-md-12 mb-5 pageTitle">
          <h6>
            <b>New Page</b>
          </h6>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <TextField
            id="search"
            label="Page Title"
            type="text"
            variant="outlined"
            size="small"
            value={title?.title}
            fullWidth
            className="mb-3"
            style={{ backgroundColor: "white" }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <p>
            <b>Select Parent Category</b>
          </p>

          <div className="col-md-8 ">
            <ButtonGroup
              variant=""
              ref={anchorRef}
              aria-label="button"
              style={{ backgroundColor: "#E9E9EE" }}
            >
              <Button
                style={{
                  color: "#2E405B",
                  borderRight: "0.5px solid rgb(255, 255, 255, .2)",
                  width: "170px",
                }}
              >
                <div>{parentValue}</div>
              </Button>
              <Button
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="menu"
                onClick={handleToggle}
                style={{ color: "#2E405B", width: "15px" }}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              style={{ zIndex: "2" }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClosebtn}>
                      <MenuList id="split-button-menu">
                        {parentPage?.map((parentTitle, index) => (
                          <MenuItem
                            key={index}
                            onClick={(event) => {
                              handleMenuItemClick(parentTitle, index);
                            }}
                          >
                            {parentTitle?.title}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          {loadEditor && (
            <div className="d-flex justify-content-center align-item-center mt-5">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          )}
          <div>
            <Editor
              apiKey="jnq6bu3a3gvvn2nvdtz5e65m7ffttui7jqw5pgo6wvksdzo1"
              value={content?.content}
              onInit={() => {
                setLoadEditor(false);
              }}
              init={{
                height: 350,
                menubar: false,
                resize: false,
                statusbar: false,
                theme_advanced_buttons1_add: "media",
                plugins: [
                  "advlist autolink lists link image media charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                  "paste",
                ],
                automatic_uploads: true,
                relative_urls: true,
                font_formats:
                  "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",

                toolbar:
                  "undo redo | formatselect | fontselect | fontsizeselect | image | media |" +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help ",

                image_title: true,

                file_picker_types: "image media",

                file_picker_callback: function (cb, value, meta) {
                  var input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "");

                  input.onchange = function () {
                    var file = this.files[0];

                    var reader = new FileReader();
                    reader.onload = function () {
                      var id = "blobid" + new Date().getTime();
                      var blobCache =
                        tinymce.activeEditor.editorUpload.blobCache;
                      var base64 = reader.result.split(",")[1];
                      var blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                },
                content_style:
                  "body { font-family:Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats }",
              }}
              onEditorChange={(value) => {
                setContent(value);
              }}
            />
          </div>

          <div className="d-flex justify-content-center m-5">
            {editMode ? (
              <Button
                variant="contained"
                className="savePaymentBtn"
                onClick={() => {
                  editAdminPage();
                }}
              >
                {loading ? (
                  <div>
                    <ClipLoader size={18} color="#1b98e0" loading />
                  </div>
                ) : (
                  `Save`
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                className="savePaymentBtn"
                onClick={() => {
                  addAdminPage();
                }}
              >
                {loading ? (
                  <div>
                    <ClipLoader size={18} color="#1b98e0" loading />
                  </div>
                ) : (
                  `Save`
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAdminPages;
