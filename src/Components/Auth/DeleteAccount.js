import React from "react";
import { useHistory } from "react-router";

const DeleteAccount = () => {
  const history = useHistory();
  return (
    <div
      style={{
        display: "grid",
        width: "350px",
        margin: "30vh auto 0",
        padding: "50px",
        borderRadius: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
        fontFamily: '"Segoe UI", sans-serif',
      }}
    >
      <p
        style={{
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        Your account has been deleted
      </p>
      <button
        style={{
          border: 0,
          outline: 0,
          backgroundColor: "#2E405B",
          padding: "10px 20px",
          borderRadius: "5px",
          color: "white",
        }}
        onClick={() => {
          history.push("/");
        }}
      >
        Go back home
      </button>
    </div>
  );
};

export default DeleteAccount;
