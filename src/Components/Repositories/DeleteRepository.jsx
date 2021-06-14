import React, { useState, useEffect } from "react";

import checkDescription from "../../Utils/CheckDescription";
import checkTitle from "../../Utils/CheckTitle";
import api from "../../Services/api";
import CloseIcon from "@material-ui/icons/Close";

import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Typography, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    textAlign: "center",
    justifyContent: "right",
  },

  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    margin: "auto",
    marginTop: "15vw",
  },
  negativeFeedback:{
    color:"#ff6961"
  },
}));

export default function DeleteRepository({ option, rep, setModalDelete, setRefresh }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
const[negativeFeedback, setNegativeFeedback]= useState(true)
  useEffect(() => {
    if (open != option) {
      setOpen(option);
    }
  });
const handleSubmit=async(ev)=>{
  try{
    
    const teste =  await api.delete(`/api/repositories/${rep.id}`);
    if(teste.status == 200){
      ev.preventDefault();
      setRefresh(true);
      handleClose()
    }else{
      setNegativeFeedback(false);
      
    }
   
  }catch(err){
    
    console.log(err)
    setNegativeFeedback(false);
   
 }
  
  
    
}

  const handleClose = () => {
    setNegativeFeedback(true);
    setOpen(false);
    setModalDelete(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal} disableBackdropClick="false">
      <div className={classes.paper}>
      <Typography variant="h6" align="right" id="title">
          <Button onClick={handleClose} >
            <CloseIcon />
          </Button>
        </Typography>
        <Typography variant="h6" align="center" id="title">
          Excluir Repositório!
        </Typography>
        <form onSubmit={(ev)=>{
            handleSubmit(ev);

            ev.preventDefault();
        }}>
          <TextField
            label="Título"
            margin="normal"
            value={rep.title}
            
          />
          <br />
          <TextField
            label="Descrição"
            margin="normal"
            value={rep.description}
            />
          <br/><br/>
          <Typography variant="h6" align="center" id="title" className={classes.negativeFeedback}>
          {!negativeFeedback ? (
                <Typography variant="subtitle">
               Não é possível excluir <strong>{rep.title}</strong>, pois ele está povoado!
              </Typography>
              ) : (
                <Typography variant="subtitle">
                  Obs:Após a exclusão de um repositório não é possível recupera-lo, está desabilitada a exclusão de repositórios povoados!
                </Typography>
              )}
       </Typography>
        <br/><br/>
          <Button type="submit" variant="contained" color="secondary" id="button">
            Confirmar
          </Button>
        </form>
      </div>
    </Modal>
  );
}