import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import checkDescription from "../../Utils/CheckDescription";
import checkTitle from "../../Utils/CheckTitle";
import api from "../../Services/api";

import CompareFilter from "../../Utils/CompareFilter"

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
}));

export default function AddRepository({ option, setModalAdd, setRefresh }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState([{ error: true }]);
  const [descriptionError, setDescriptionError] = useState([]);

  useEffect(() => {
    if (open != option) {
      setOpen(option);
    }
  });
  const handleSubmit = () => {
    api.post("/api/repositories", { title, description });
  };

  const handleClose = () => {
    setOpen(false);
    setModalAdd(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}  disableBackdropClick="false">
      <div className={classes.paper}>
      <Typography variant="h6" align="right" id="title">
          <Button onClick={handleClose} >
            <CloseIcon />
          </Button>
        </Typography>
        <Typography variant="h6" align="center" id="title">
          Adicionar Repositório!
        </Typography>
        <form
          onSubmit={(event) => {
            if (
              checkTitle(title).isValid == true &&
              checkDescription(description).isValid == true
            ) {
              handleSubmit();
              event.preventDefault();
              setRefresh(true);
              handleClose();
              setRefresh(true);
              handleClose();
              setTitle("");
              setDescription("");
            } else {
              event.preventDefault();
            }
          }}
        >
          <TextField
            label="Título"
            margin="normal"
            value={title}
            required
            onBlur={(event) => {
              const isValid = checkTitle(title);

              setTitleError(isValid);
            }}
            error={titleError.error}
            helperText={titleError.msg}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <br />
          <TextField
            label="Descrição"
            margin="normal"
            aria-label="empty textarea"
            value={description}
            onBlur={(event) => {
              const isValid = checkDescription(description);

              setDescriptionError(isValid);
            }}
            error={descriptionError.error}
            helperText={descriptionError.msg}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
          <br />
          <br />

          <Button type="submit" variant="contained" color="primary" id="button">
            Confirmar
          </Button>
        </form>
      </div>
    </Modal>
  );
}
