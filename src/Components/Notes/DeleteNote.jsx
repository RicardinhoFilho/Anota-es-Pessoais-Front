import React, { useState, useEffect } from "react";
import api from "../../Services/api";

import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Typography, Button } from "@material-ui/core";



import CloseIcon from "@material-ui/icons/Close";

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

export default function DeleteRepository({ option, note, setModalDelete, setRefresh, setNote}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open != option) {
      setOpen(option);
    }

    console.log("option:" , option)
  });
const handleSubmit=()=>{
    api.delete(`/api/note/${note.id}`);
    setNote("")
}

  const handleClose = () => {
    setModalDelete(false);
    setOpen(false);
  };

  return (
    <Modal
    open={open}
    onClose={handleClose}
    className={classes.modal}
    disableBackdropClick="false"
  >
    <div className={classes.paper}>
      <Typography variant="h6" align="right" id="title">
        <Button onClick={handleClose} >
          <CloseIcon />
        </Button>
      </Typography>
        <Typography variant="h6" align="center" id="title">
          Excluir Anotação!
        </Typography>
        <form onSubmit={(ev)=>{
            handleSubmit();
            ev.preventDefault();
            setRefresh(true);
            handleClose()
        }}>
          <TextField
            label="Título"
            margin="normal"
            value={note.title}
            
          />
          <br />
          <TextField
            label="Descrição"
            margin="normal"
            value={note.description}
            />
            <br/>
            <TextField
            label="Anotação"
            margin="normal"
            value={note.annotation}
            />
          <br/><br/>
          <Typography variant="h6" align="center" id="title" className={classes.negativeFeedback}>
          Obs:Após a exclusão de uma anotação não é possível recupera-la!
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