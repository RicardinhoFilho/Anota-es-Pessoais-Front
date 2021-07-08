import React, { useEffect, useState, useRef } from "react";


import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce/tinymce';

// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/help';


// import { handleBase64 } from "../../Services/base64Handle";



import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Modal, TextField } from "@material-ui/core/";

import CheckIcon from "@material-ui/icons/Check";
//Editor

import draftToHtml from "draftjs-to-html";

import checkDescription from "../../Utils/CheckDescription";
import checkTitle from "../../Utils/CheckTitle";
import api from "../../Services/api";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  annotation: {
    marginTop: "0.2rem",
    textAlign: "center",

    marginLeft: "3rem",
    marginRight: "3rem",

    //border:"1px solid black",
    borderRadius: "2px",
  },
  wrapperClass: {
    padding: "1rem",
    border: "1px solid #ccc",
  },
  editorClass: {
    //backgroundColor:"lightgray",
    padding: "1rem",
    border: "1px solid #ccc",
    maxHeight: window.screen.height - 500,
    overflowY: "scroll",
  },
  toolbarClass: {
    //display:"block",
    //position:"fixed",

    width: "100%",
    background: "lightgray",
    textAlign: "center",
    padding: "20px 0",
    // border: "1px solid #ccc",
    // padding: "0.8rem",
    // position: "fixed"
  },
  submitButton: {
    backgroundColor: "#3f51b5",
    color: "#fff",
  },
  modalSucces: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    maxWidth: 400,
    display: "flex",
    justifyContent: "space-between",
    margin: "auto",
    marginTop: "10%",
  },
  modalHandler:{
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    maxWidth: 400,
    display: "flex",
    justifyContent: "space-between",
    margin: "auto",
    marginTop: "10%",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function EditorMobile() {
  const { token, repId } = useParams();
  const editorRef = useRef(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [modalSucces, setModalSucces] = useState(false);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState([{ error: true }]);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState([]);

  const [annotation, setAnnotation] = useState("");
  const [annotationError, setAnnotationError] = useState([]);

  const [responseError, setResponseError] = useState([]);

 

  const handleModalSucces = () => {
    setModalSucces(!modalSucces);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
   
    if (checkTitle(title).isValid == false) {
      window.alert(`${checkTitle(title).msg} 😨`);
      return;
    }
    if (checkDescription(description).isValid == false) {
      window.alert(`${checkDescription(description).msg} 😨`);
      return;
    }

    if (!editorRef.current) {
      window.alert("Não é possível armazenar uma nota sem conteúdo 😣")
      return
    }
    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      console.log(`${token} é este`);
      if (description.length == 0) {
        await api.post(`/api/notes/${repId}`, {
          title,
          annotation: editorRef.current.getContent(),
        });
      } else
        await api.post(`/api/notes/${repId}`, {
          title,
          description,
          annotation: editorRef.current.getContent(),
        });
      handleModalSucces();
      setTitle("");
      setAnnotation("");
      setDescription("");
      setResponseError("");

      handleClose();
    } catch (err) {
      setResponseError(err.message);
      window.alert(`Infelizmente não foi possível salvar sua anotação 😱\n 
        Passo 1- Cheque se não tem nenhum caractere indevido em sua nota como um emoji!\n
        Passo 2- Caso não conseguiu identificar nada indevido em sua anotação salve-a em um documento como Word\n
        Passo 3- Entre em contato com ricardinhogiasson16@gmail.com
        `);
    }
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Adicionar Nota
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <List>
          <ListItem>
            <TextField
              label="Título"
              margin="normal"
              value={title}
              required
              fullWidth="true"
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
          </ListItem>
          <Divider />
          <ListItem>
            <TextField
              label="Descrição"
              margin="normal"
              fullWidth="true"
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
          </ListItem>
          <div className={classes.annotation}>
          <Editor
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={""}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                  'bold italic backcolor color | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat |  ',//image |help
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
            <div id={"preview"} classes={classes.contentEditableHidden}></div>
          </div>
          <br />
          <Typography align="center">
            <Button onClick={handleSubmit} className={classes.submitButton}>
              Salvar <CheckIcon />
            </Button>
          </Typography>
          {responseError}
        </List>
      </Dialog>
      <Modal open={modalSucces} classes={classes.modalHandler}>
        <Typography align="center">
          <div className={classes.modalSucces}>
            <div>
              <span>Anoatação Criada Com Sucesso!</span>
            </div>
            <div>
              {" "}
              <Button
                onClick={handleModalSucces}
                className={classes.submitButton}
              >
                <CheckIcon />
              </Button>
            </div>
          </div>
        </Typography>
      </Modal>
    </div>
  );
}
