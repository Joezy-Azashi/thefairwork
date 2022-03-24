import { Card, CardContent, Dialog, Menu, MenuItem } from "@material-ui/core";
import MoreVertRoundedIcon from "@material-ui/icons/MoreVertRounded";
import { useState } from "react";
import { useHistory } from "react-router";
import DeleteCard from "./DeleteCard";
import EditCard from "./EditCard";
import Api from "../../Services/api"
import DeleteAndSaveCard from './DeleteAndSaveCard';


const Categoryskills = ({ categories, skills, changeData, closeDeleteAndSave }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState([]);
  const history = useHistory();
  const [selectedVal, setSelectedVal] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteAndSave,setOpenDeleteAndSave] = useState(false)
  const [deleteId, setdeleteId] = useState()

  const handleEditandDelete = (e, id) => {
    setAnchorEl(e.currentTarget);
    setSelectedVal(id);
    setdeleteId(id?.id)
  };

  const closeDeleteAndSave1 = () => {
    setOpenDeleteAndSave(false);
  };

  const handleDelete = () => {
    Api()
    .get(`/admin/categories/check-attachments/${deleteId}`)
    .then(
      (response)=>{
 
       if(response.data.isAttachmentsAvailable === true){
         setOpenDeleteAndSave(true)
       }else{
         setOpenDeleteDialog(true);
       }
   
      }
    ).catch((error)=>{
      
    })
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const closeEditDia = () => {
    setOpenEditDialog(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Card
        style={{ marginBottom: "30px", overflow: "auto", height: "405px" }}
        id="local"
        sx={{ boxShadow: 0 }}
        
      >
        <CardContent>
          {categories?.map(
            (cate) =>
              cate?.Categories &&
              cate.Categories.map((skillcategory) =>
                skillcategory.parentId == skills ? (
                  <div className="mb-1 mt-1 ml-2">
                    <Card
                      style={{ backgroundColor: "#2E405B26", marginBottom: "12px" }}
                      key={skillcategory.id}
                    >
                      <CardContent>
                        <div className="d-flex justify-content-between">
                          <p
                            className="category"
                            gutterbottom="true"
                            style={{
                              color: "#2E405B",
                              cursor: "default",
                              textTransform: "capitalize",
                            }}
                            title={
                              skillcategory?.category?.length > 21
                                ? skillcategory?.category
                                : ``
                            }
                          >
                            {skillcategory.category}
                          </p>
                          <MoreVertRoundedIcon
                            style={{ color: "#2E405B" }}
                            onClick={(e) =>
                              handleEditandDelete(e, skillcategory)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  ""
                )
              )
          )}
        </CardContent>
      </Card>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ marginTop: "27px" }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <DeleteCard del={selectedVal} closeDeleteDia={closeDeleteDia} />
      </Dialog>

      <Dialog
        open={openDeleteAndSave}
        onClose={closeDeleteAndSave1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
      {/*NEW DELETE AND SAVE OPTION*/}
        <DeleteAndSaveCard deleteId={deleteId} del={userData} closeDeleteAndSave={closeDeleteAndSave1} changeData={changeData}/>
      </Dialog>

      <Dialog
        open={openEditDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <EditCard selectedVal={selectedVal} closeEditDia={closeEditDia} />
      </Dialog>
    </div>
  );
};

export default Categoryskills;
