import React from "react";

import Filters from "../Components/Categories/Filters";

function AdminPlatformCategory() {
  return (
    <div>
      <div className="row">
        <div className="col-md-12 pageTitle">
          <h6>
            <b>Freelance Categories</b>
          </h6>
        </div>
      </div>
      <Filters />
    </div>
  );
}
export default AdminPlatformCategory;
