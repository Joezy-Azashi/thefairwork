import React from "react";

const ClientBanner = () => {
  return (
    <div
      className="client-banner"
      style={{
        width: "100%",
        marginBottom: "15px",
        borderRadius: "10px",
        padding: "25px",
        color: "white",
        background:
          "linear-gradient(90deg, rgba(71,120,236,1) 56%, rgba(96,239,255,1) 99%)",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "800",
          marginBottom: "15px",
        }}
      >
        Thank you for signing up!
      </h3>
      <p
        style={{
          fontSize: "15px",
          textAlign: "justify",
        }}
      >
        You currently have limited access to the platform's functionalities as
        we are in the final testing stages. In the meantime, please feel free to
        create your profile and explore freelancers on the platform. We will
        send you an email as soon as we have officially launched, and you can
        interact with other parties. Follow us on{" "}
        <a
          href="https://www.linkedin.com/company/thefairwork"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none" }}
        >
          <span style={{ textDecoration: "underline", color: "white" }}>
            Linkedin
          </span>
        </a>{" "}
        for more updates: TheFairWork
      </p>
    </div>
  );
};

export default ClientBanner;
