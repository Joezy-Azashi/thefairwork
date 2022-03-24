import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Api from "../Services/api";


function GranChild({ showGrandChild, grandChildData, hideGrandChild }) {
    const history = useHistory();

    const getSinglePage = async(grandChild) => {
        Api().get(`/pages/${grandChild?.id}`)
        .then((response) => {
            history.push(`/page/${(grandChild?.title).toLowerCase().split(" ").join("-")}`, {params: grandChild});
            window.location.reload()
        }).catch((error) => {
        })
      }

      const hideChildDrpdown = () => {
        hideGrandChild()
      }

  return (
    <div
      style={{ display: showGrandChild && grandChildData?.Pages?.length > 0 ? "block" : "none",
       width: "250px",
        padding: "4px 10px",
        backgroundColor: "#FFFFFF",
        color: "black",
        borderRadius: "3px",
        marginTop: "12px"
        }}
    >
  
      {grandChildData?.Pages?.map((grandChild) => {
        return (
          <div>
            <div sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              <p style={{ textTransform: "capitalize", cursor: "pointer", marginBottom: "0" }}
                    onClick={() => {
                        getSinglePage(grandChild)
                      }}
                      className="pageMenuText"

                      onMouseLeave={() => {
                        hideChildDrpdown()
                      }}
              >
                  {grandChild?.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GranChild;
