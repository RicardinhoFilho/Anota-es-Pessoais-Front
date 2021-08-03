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


import { handleBase64 } from "../../Services/base64Handle";



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
import { TextField } from "@material-ui/core/";

import CheckIcon from "@material-ui/icons/Check";

import draftToHtml from "draftjs-to-html";

import checkDescription from "../../Utils/CheckDescription";
import checkTitle from "../../Utils/CheckTitle";
import api from "../../Services/api";

// import { useHistory } from "react-router-dom";

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
  inputsHidden:{
    display:'none',
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function EditeNoteMobile() {
  const { token, noteId } = useParams();

  const editorRef = useRef(null);
  // const history = useHistory();

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState([{ error: true }]);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState([]);

  const [annotation, setAnnotation] = useState("");
  const [annotationError, setAnnotationError] = useState([]);

  const [responseError, setResponseError] = useState([]);

  const [editorStyleHidden, setEditorStyleHidden] = useState(false);


  const log = async () => {
    if (editorRef.current) {
      var preview = (editorRef.current.getContent());
      // console.log(preview);
      document.getElementById("preview").innerHTML = (editorRef.current.getContent());
      const images = document.getElementsByTagName("img");
      const aux = await handleBase64(preview, images, noteId)
      return aux;
    }
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEditorStyleHidden(true);
  };

  const handleSubmit = async () => {
    const final = await log();
    if (checkTitle(title).isValid == false) {
      window.alert(`${checkTitle(title).msg} 😨`);
      return;
    }

    if (
      final.lenght === 0
    ) {
      window.alert("Não é possível armazenar uma nota sem conteúdo 😣");
      return;
    }

    try {
      const response = await api.patch(`/api/note/${noteId}`, {
        title,
        description,
        annotation:final,
      });
      

      
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

  useEffect(() => {
    async function getNote() {
      localStorage.setItem("token", token);
      try {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        //console.log("antes", annotation);
        const noteResponse = await api.get(`/api/note/${noteId}`);
        const note = await noteResponse.data[0];
        setTitle(note.title);
        setDescription(note.description);
        setAnnotation(note.annotation)

       
      } catch (err) {
        window.alert(`Não é possivel encontrar a nota ${noteId}`);
      }
    }

    getNote();
  }, []);

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
          <ListItem className={editorStyleHidden? classes.inputsHidden : ""}>
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
          <ListItem className={editorStyleHidden? classes.inputsHidden : ""}>
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
            {!editorStyleHidden ? <Editor 
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={annotation[0] === "{" ? draftToHtml(JSON.parse(annotation)) : annotation}
              init={{
                display:editorStyleHidden? 'none' : '',
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
                  'removeformat |  ',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            /> : ""}
            
          </div>
          <div id={"preview"}>

            </div>
          <br />
          <Typography align="center" className={editorStyleHidden? classes.inputsHidden : ""}>
            <Button onClick={handleSubmit} className={classes.submitButton}>
              Salvar <CheckIcon />
            </Button>
          </Typography>
          {responseError}
        </List>
      </Dialog>
    </div>
  );
}
