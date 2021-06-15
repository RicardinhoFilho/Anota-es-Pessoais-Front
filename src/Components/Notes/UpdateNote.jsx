import React, { useState, useEffect } from "react";
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
//Editor
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromHTML, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { stateFromHTML } from "draft-js-import-html";
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
    maxHeight: (window.screen.height - 500),
    overflowY: "scroll"
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
  const [open, setOpen] = React.useState(false);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState([{ error: true }]);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState([]);

  const [annotation, setAnnotation] = useState("");
  const [annotationError, setAnnotationError] = useState([]);

  const [responseError, setResponseError] = useState([]);
  //console.log(note.annotation[0] === "{" ? "Deu certo" : "não deu certo")
  const [editorState, setEditorState] = useState(() => note.annotation ? (
    note.annotation[0] === "{" ? (
      EditorState.createWithContent(convertFromRaw(JSON.parse(note.annotation)))
    ) : (
      EditorState.createWithContent(stateFromHTML(note.annotation))
    )
  ) : ""
  );
  const onEditorStateChange = (editorState) => {

    this.setState({
      editorState,
    });


  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalUpdate(false);
  };

  const handleSubmit = async () => {
    setAnnotation(draftToHtml(convertToRaw(editorState.getCurrentContent())))//Altera valor da anotação
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


    if (JSON.stringify(convertToRaw(editorState.getCurrentContent())).length <= 133) {
      window.alert("Não é possível armazenar uma nota sem conteúdo 😣")
      return
    }
    {
      try {
        const response = await api.patch(`/api/note/${note.id}`, {
          title,
          description,
          annotation: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        });
        const id = note.id;
        setNote({ id, title, description, annotation: JSON.stringify(convertToRaw(editorState.getCurrentContent())), id });
        setRefresh(true);

        setTitle("");
        setAnnotation("");
        setDescription("");
        setResponseError("");
        //setEditorState(() => EditorState.createEmpty());
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
            <Button autoFocus color="inherit" onClick={handleSubmit}>
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
              editorState={editorState}
              wrapperClassName={classes.wrapperClass}
              editorClassName={classes.editorClass}
              toolbarClassName={classes.toolbarClass}
              onEditorStateChange={setEditorState}
            />
          </div>

          {responseError}
        </List>
      </Dialog>
    </div>
  );
}
