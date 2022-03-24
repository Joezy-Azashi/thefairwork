import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Snackbar } from "@material-ui/core";
import Api from "../Services/api";
import { useLocation } from "react-router";
import { Alert } from "@material-ui/lab";
import { ClipLoader } from "react-spinners";

function AdminPayments() {
  const location = useLocation();
  const [paymentDetails, setpaymentDetails] = useState(location?.state?.params);
  const [open1, setOpen1] = useState(false);
  const [loadEditor, setLoadEditor] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const closeAlert = () => {
    setTimeout(() => {
      setOpen1(false);
    }, 4000);
  };

  const addPaymentProcess = async () => {
    const data = {
      details: paymentDetails,
    };

    Api()
      .put("/admin/payment-details", data)
      .then((response) => {
        window.location.assign("/view-payments");
      })
      .catch((error) => {
        setOpen1(true);
        closeAlert();
      });
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-12 pageTitle">
          <h6>
            <b>Payment Process</b>
          </h6>
        </div>
      </div>

      {loadEditor && (
        <div className="d-flex justify-content-center align-item-center mt-5">
          <ClipLoader size={40} color="#1b98e0" loading />
        </div>
      )}

      <div>
        <Editor
          apiKey="jnq6bu3a3gvvn2nvdtz5e65m7ffttui7jqw5pgo6wvksdzo1"
          value={paymentDetails}
          onInit={() => {
            setLoadEditor(false);
          }}
          init={{
            height: 350,
            menubar: false,
            resize: false,
            statusbar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
              "paste",
            ],

            font_formats:
              "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",

            toolbar:
              "undo redo | formatselect | fontselect | fontsizeselect |" +
              "bold italic backcolor | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats }",
          }}
          onEditorChange={(value) => {
            setpaymentDetails(value);
          }}
        />
      </div>

      <div className="d-flex justify-content-center m-5">
        <Button
          variant="contained"
          className="savePaymentBtn"
          onClick={() => {
            addPaymentProcess();
          }}
        >
          Save
        </Button>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open1}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert severity="error">Error adding a payment processs</Alert>
      </Snackbar>
    </div>
  );
}

export default AdminPayments;
