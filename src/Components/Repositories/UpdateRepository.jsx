import React, { useState, useEffect } from "react";

import checkDescription from "../../Utils/CheckDescription";
import checkTitle from "../../Utils/CheckTitle";
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
  button: {
    backgroundColor: "#FFFF00",
    opacity: ["0.8"].join(","),
    "&:hover": {
      backgroundColor: "#FFFF00",
      opacity: "1",
    },
  },
}));

export default function UpdateRepository({ option, rep, setModalUpdate, setRefresh }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState([]);
  const [descriptionError, setDescriptionError] = useState([]);

  useEffect(() => {
    if (open != option) {
      setOpen(option);
      setTitle(rep.title);
      setDescription(rep.description);
    }
  });
  const handleSubmit = () => {
    if (title === rep.title) {
      api.patch(`/api/repositories/${rep.id}`, { description });
    }
    if (description === rep.description) {
      api.patch(`/api/repositories/${rep.id}`, { title });
    }
    api.patch(`/api/repositories/${rep.id}`, { title, description });
  };

  const handleClose = () => {
    setOpen(false);
    setModalUpdate(false);
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
          Editar Repositório!
        </Typography>
        <form
          onSubmit={(event) => {
            if (
              titleError.isValid != false &&
             descriptionError.isValid != false
            ) {
              handleSubmit();
              event.preventDefault();
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
              if (typeof title !== "object") {
                const isValid = checkTitle(title);

                setTitleError(isValid);
              }
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
            value={description}
            onBlur={(event) => {
              if (typeof description !== "object") {
                const isValid = checkDescription(description);
                setDescriptionError(isValid);
              }
            }}
            error={descriptionError.error}
            helperText={descriptionError.msg}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
          <br /> <br />
          <Button
            type="submit"
            variant="contained"
            id="button"
            className={classes.button}
          >
            Confirmar
          </Button>
        </form>
      </div>
    </Modal>
  );
}
