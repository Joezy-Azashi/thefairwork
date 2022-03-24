import { Card, CardContent, Dialog, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalSkills from "./LocalSkills";
import MoreVertRoundedIcon from "@material-ui/icons/MoreVertRounded";
import { useState } from "react";

import { useHistory } from "react-router";
import DeleteCard from "./DeleteCard";
import EditCard from "./EditCard";
import Api from "../../Services/api";
import DeleteAndSaveCard from "./DeleteAndSaveCard";

const useStyles = makeStyles({
  root: {
    minWidth: 270,
    minHeight: 10,
  },

  title: {
    fontSize: 14,
    textAlign: "center",
    color: "#2E405B",
  },
  backgroundColor: "#2E405B",

  dialog: {
    position: "absolute",
    left: 600,
    top: 250,
  },
});

const LocalCategoryCard = ({ categories, cat, changeData }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVal, setSelectedVal] = useState();
  const [userData, setUserData] = useState([]);
  const [openDeleteAndSave,setOpenDeleteAndSave] = useState(false)
 

  const handleEditandDelete = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedVal(cat.id);
    setUserData(cat);
  };


  
  const handleDelete = async() => {
   
    Api()
   .get(`/admin/industries/check-attachments/${selectedVal}`)
   .then(
     (response)=>{

      if(response.data.isAttachmentsAvailable===true){
        setOpenDeleteAndSave(true)
     
      }else{
  
        setOpenDeleteDialog(true);
      }
  

     }
   ).catch((error)=>{})
    
   
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

  const handleEdit = () => {
    setOpenEditDialog(true);
  };
  const closeDeleteAndSave = () => {
    setOpenDeleteAndSave(false);
  };
  return (
    <>
      <div className="col-md-4" >
        <Card
          className="mt-3"
          style={{ color: "#2E405B", marginBottom: "12px" }}
          sx={{ boxShadow: 2 }}
          key={cat.id}
        >
          <CardContent   >
            <div className="d-flex justify-content">
              <p
                className="category"
                style={{
                  color: "#2E405B",
                  cursor: "default",
                  textTransform: "capitalize",
                }}
                title={
                  cat?.name && cat?.name?.length > 21
                    ? cat?.name
                    : ``
                } 
              >
                {cat?.name}{" "}
              </p>
              <MoreVertRoundedIcon
                onClick={handleEditandDelete}
                style={{ marginRight: "18px" }}
              />
            </div>
          </CardContent>
        </Card>
        
        <LocalSkills categories={categories} skills={cat.id} key={cat?.name} deleteId={selectedVal} del={userData} closeDeleteAndSave={closeDeleteAndSave} changeData={changeData} />
       
      

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
      </div>

      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <DeleteCard deleteId={selectedVal} closeDeleteDia={closeDeleteDia} />
      </Dialog>
      <Dialog
        open={openDeleteAndSave}
        onClose={closeDeleteAndSave}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
      {/*NEW DELETE AND SAVE OPTION*/}
        <DeleteAndSaveCard deleteId={selectedVal} del={userData} closeDeleteAndSave={closeDeleteAndSave} changeData={changeData}/>
      </Dialog>

      <Dialog
        open={openEditDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <EditCard closeEditDia={closeEditDia} userData={userData} />
      </Dialog>
    </>
  );
};

export default LocalCategoryCard;
