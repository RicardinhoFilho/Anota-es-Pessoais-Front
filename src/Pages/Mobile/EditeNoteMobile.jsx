import React, { useEffect, useState } from "react";
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
//Editor
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

import { stateFromHTML } from "draft-js-import-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

import checkDescription from "../../Utils/CheckDescription";
import checkTitle from "../../Utils/CheckTitle";
import api from "../../Services/api";

import { useHistory } from "react-router-dom";

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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function EditeNoteMobile() {
  const { token, noteId } = useParams();

  const history = useHistory();

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState([{ error: true }]);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState([]);

  const [annotation, setAnnotation] = useState("");
  const [annotationError, setAnnotationError] = useState([]);

  const [responseError, setResponseError] = useState([]);

  //editor
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
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
  };

  const handleSubmit = async () => {
    setAnnotation(draftToHtml(convertToRaw(editorState.getCurrentContent()))); //Altera valor da anotação
    if (checkTitle(title).isValid == false) {
      window.alert(`${checkTitle(title).msg} 😨`);
      return;
    }
    // if (checkDescription(description).isValid == false) {
    //   window.alert(`${checkDescription(description).msg} 😨`);
    //   return;
    // }

    if (
      JSON.stringify(convertToRaw(editorState.getCurrentContent())).length <=
      133
    ) {
      window.alert("Não é possível armazenar uma nota sem conteúdo 😣");
      return;
    }

    try {
      const response = await api.patch(`/api/note/${noteId}`, {
        title,
        description,
        annotation: JSON.stringify(
          convertToRaw(editorState.getCurrentContent())
        ),
      });

      setTitle("");
      setDescription("");
      setResponseError("");
      setEditorState(() => EditorState.createEmpty());
      history.push(`/note/${noteId}`);
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
      try {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        console.log("antes", annotation);
        const noteResponse = await api.get(`/api/note/${noteId}`);
        const note = await noteResponse.data[0];
        setTitle(note.title);
        setDescription(note.description);
        setAnnotation(note.annotation)
        
        note.annotation[0] === "{"
          ? setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(note.annotation))
              )
            )
          : setEditorState(
              EditorState.createWithContent(stateFromHTML(note.annotation))
            );
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
          <br />
          <Typography align="center">
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
