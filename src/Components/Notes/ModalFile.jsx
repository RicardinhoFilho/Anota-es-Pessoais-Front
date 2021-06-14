import React, { useState, useEffect, useRef } from "react";

import trashImage from "../../Assets/Trash.svg";
import api from "../../Services/api";

import { makeStyles } from "@material-ui/core/styles";
import {
  Modal,
  TextField,
  Typography,
  Button,
  TextareaAutosize,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    textAlign: "center",
    justifyContent: "right",
    display: "block",
  },

  paper: {
    maxWidth: 1000,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    margin: "auto",
    marginTop: "8vw",
    overflowY: "initial",
  },
  form: {
    maxHeight: "30vw",
    overflowY: "auto",
  },
  link: {
    color: "black",
    textDecoration: "none",
  },
  button: {
    margin: "5px",
  },
  alertMessage:{
    color:"red"
  }
}));

export default function ModalFile({ option, setModalFile, file, setRefresh }) {
  
  let cont = 0;

 

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const[printMessage, setPrintMessage] = useState(false);

  useEffect(() => {
    if (open != option) {
      setOpen(option);
    }
  });
  const handleSubmit = async () => {
    await api.delete(`/api/file/${file.id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setModalFile(false);
    setPrintMessage(false);
    cont = 0;
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <div className={classes.paper}>
        <Typography variant="h6" align="center" id="title">
          Abrir Anexo
        </Typography>
        <form className={classes.form}>
          <TextField label="Título" margin="normal" value={file.title} />
          <br />
          {printMessage ?  <Typography variant="h6" align="center" className={classes.alertMessage}>
        Após a exclusão deste anexo, não será possivel recupera-lo!
      </Typography> :  ""}
          <Button
            
            color="secondary"
            id="button"
            className={classes.button}
            onClick={(ev) => {
              cont++;
              ev.preventDefault();
              console.log(cont);
              setPrintMessage(true);
              if (cont > 1) {
                setPrintMessage(true);
                cont = 0;
                handleSubmit();
                setRefresh(true);
                handleClose();
              }
            }}
          >
            <img src={trashImage} alt="Deletar Anexo"/>
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            id="button"
            onClick={(ev) => {
              handleClose();
            }}
            className={classes.button}
          >
            <a
              href={`http://cpro47698.publiccloud.com.br/uploads/${file.file}`}
              target="_blank"
              className={classes.link}
            >
              Vizualizar Anexo
            </a>
          </Button>
        </form>
      </div>
    </Modal>
  );
}
