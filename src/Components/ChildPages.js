import React, { useState} from "react";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import GranChild from "./GranChild";
import { useHistory } from "react-router";
import Api from "../Services/api";

function ChildPages({ showChils, childData, pagesIndex }) {
  const history = useHistory();
  const [showGrandChild, setShowGrandChild] = useState(false);
  const [grandChildData, setGrandChildData] = useState();
  const [childIndex, setChildIndex] = useState()

  const getSinglePage = async(children) => {
    Api().get(`/pages/${children?.id}`)
    .then((response) => {
        children?.Pages?.length > 0 ? history.push("") : history.push(`/page/${(children?.title).toLowerCase().split(" ").join("-")}`, {params: children});
        window.location.reload()
    }).catch((error) => {
    })
  }

  const hideGrandChild = () => {
    setShowGrandChild(false)
  }

  return (
    <div className="d-flex">
      <div
        style={{
          display: showChils &&  childData?.Pages?.length > 0 ? "block" : "none",
          width: "200px",
          padding: "4px 10px",
          marginRight: "5px",
          borderRadius: "5px",
          marginLeft: pagesIndex === 0 ? `5px` : pagesIndex === 1 ? pagesIndex * 82 + "px" : pagesIndex === 2 ? pagesIndex * 95 + "px" : pagesIndex === 3 ? pagesIndex * 97 + "px" : `350px`,
          backgroundColor: "#FFFFFF",
          marginTop: "12px"
        }}
      >
        {childData?.Pages?.map((children, index) => {
          return (
            <div
              className="d-flex justify-content-between"
              onMouseOver={() => {
                setShowGrandChild(true);
                setGrandChildData(children);
                setChildIndex(index)
              }}
            >
              <div>
                <p
                  style={{ textTransform: "capitalize", cursor: "pointer" }}
                  onMouseLeave={() => {
                    setShowGrandChild(false);
                  }}
                  onClick={() => {
                    getSinglePage(children)
                  }}
                  className="mb-0 pageMenuText"
                >
                  {children?.title}
                </p>
              </div>

              {children?.Pages?.length > 0 ? (
                <div>
                  <Icon
                    path={mdiChevronRight}
                    size={0.8}
                    horizontal
                    vertical
                    color="#2E405B"
                    rotate={180}
                    style={{marginTop: "10px"}}
                  />
                </div>
              ) : (
                ``
              )}
            </div>
          );
        })}
      </div>

        <GranChild
          grandChildData={grandChildData}
          showGrandChild={showGrandChild}
          childIndex={childIndex}
          hideGrandChild={hideGrandChild}
        />
    </div>
  );
}

export default ChildPages;
