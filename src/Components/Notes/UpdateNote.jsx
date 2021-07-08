import React, { useState, useEffect, useRef } from "react";



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
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import CreateIcon from '@material-ui/icons/Create';

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

  contentEditable: {

  },
  contentEditableHidden: {
    display: "none",
  },
}));



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  option,
  note,
  setModalUpdate,
  setRefresh,
  setNote,
}) {
  const classes = useStyles();
  const editorRef = useRef(null);
  const [open, setOpen] = React.useState(false);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState([{ error: true }]);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState([]);

  const [annotation, setAnnotation] = useState("");
  const [annotationError, setAnnotationError] = useState([]);

  const [responseError, setResponseError] = useState([]);

  const [editorDiv, setEditorDiv] = useState(true);


  const log = async() => {
    if (editorRef.current) {
      var preview = (editorRef.current.getContent());
      // console.log(preview);
      document.getElementById("preview").innerHTML = (editorRef.current.getContent());
      const images = document.getElementsByTagName("img");
      const aux = await handleBase64(preview, images, note.id)
      return aux;
    }
  };

  //console.log(note.annotation[0] === "{" ? "Deu certo" : "não deu certo")
  const [content, setContent] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalUpdate(false);
  };

  const handleSubmit = async () => {
    const final = await log();

    //console.log(final)
    //window.alert("olha aqui caramba", annotation)
    if (
      checkTitle(title).isValid == false
    ) {
      window.alert(`${checkTitle(title).msg} 😨`);
      return;
    }
    if (description) {
      if (
        checkDescription(description).isValid == false
      ) {
        window.alert(`${checkDescription(description).msg} 😨`);
        return;
      }
    }


    if (annotation < 0) {
      window.alert("Não é possível armazenar uma nota sem conteúdo 😣")
      return
    }
    {
      try {
        const response = await api.patch(`/api/note/${note.id}`, {
          title,
          description,
          annotation:final,
        });
        const id = note.id;
        setNote({ id, title, description, annotation:final, id });
        setRefresh(true);

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
        `
        )
      }
    }
  };

  useEffect(() => {
    if (open != option) {
      //console.log(note.annotation)
      setOpen(option);
      setTitle(note.title);
      setDescription(note.description);
      setAnnotation(note.annotation);

      handleClickOpen();
    }
  }, [option]);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Atualizar Anotação
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}/*handleSubmit */>
              Salvar <CheckIcon />
            </Button>
          </Toolbar>
        </AppBar>
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
              initialValue={note.annotation[0] === "{" ? draftToHtml(JSON.parse(note.annotation)) : note.annotation}
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
                  'removeformat |  ',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
            <div id={"preview"} classes={classes.contentEditableHidden}>

            </div>
          </div>

          {responseError}
        </List>
      </Dialog>
    </div>
  );
}
