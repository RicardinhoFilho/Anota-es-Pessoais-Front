import React, { useEffect, useState } from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
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
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import ModalFile from "../Components/Notes/ModalFile";
import UpdateNote from "../Components/Notes/UpdateNote";
import Delete from "../Components/Notes/DeleteNote";

import { useHistory, useParams } from "react-router-dom";
import AddFile from "../Components/Notes/AddFile";
import api from "../Services/api";
import checkExtension from "../Utils/CheckExtension";

import { AutoFormatTitle } from "../Utils/AutoFormatTitle";

import trashImage from "../Assets/Trash.svg";
import editImage from "../Assets/Edit.svg";
import draftToHtml from "draftjs-to-html";
import Loading from "../Components/Loading";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  description: {
    backgroundColor: "#d3d3d3",
  },
  annotation: {
    // marginTop: "5vw",
    textAlign: "left",

    marginLeft: "2rem",
  },
  imageButtons: {
    width: 30,
  },
  wrapperClass: {},
  toolbarClass: {
    opacity: 0,
    display: "none",
  },
  push: {
    height: "50px",
  },
  footer: {
    //marginTop: "50px",
    backgroundColor: "#d3d3d3",
  },
  linkDiv: {
    display: "inline",
    marginTop: "20px",
  },

  buttonFile: {
    margin: "5px",
  },
  fileTitle: {
    fontSize: "12px",
  },

  capitalize: {
    width: "100%",
    marginBottom: "1em",
    textTransform: "capitalize",
  },
  files: {
    display: "flex",
    alignItems: "center",
  },
  hiddenFile: {
    display: "none"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Note() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [modalAddFile, setModalAddFile] = useState(false);
  const [modalFile, setModalFile] = useState(false);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState([]);
  const [note, setNote] = useState([]);
  const [formatNote, setFormatNote] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [fileLoader, setFileLoader] = useState(true);
  const [noteLoader, setNoteLoader] = useState(true);

  const history = useHistory();
  const { id } = useParams();

  const [titleFormat, setTitleFormat] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  function handleModalUpdate(id, title, description, annotation) {
    setFormatNote({ id, title, description, annotation });
    //console.log(note);
    setModalUpdate(true);
  }

  async function getFileData() {
    setFileLoader(true);
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      const fileResponse = await api.get(`/api/files/${id}`);
      setFiles(fileResponse.data);
    }

    setFileLoader(false);
  }

  async function getData() {
    setNoteLoader(true);
    const token = localStorage.getItem("token");
    ////console.log("teste")
    if (token) {
      //setFileLoader(true);
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      const noteResponse = await api.get(`/api/note/${id}`);
      // //console.log("teste",result);

      setNote(noteResponse.data[0]);
      // document.getElementById("note").innerHTML = note.annotation[0] === "{" ? draftToHtml(JSON.parse(note.annotation)) : (note.annotation)
      // console.log(note)
      setNoteLoader(false);
    } else {
      history.push("/login");
    }
  }

  async function checkTitleFormatPreferences() {
    const checkTitleFormatPreferences = await localStorage.getItem(
      "titleFormatPreferences"
    );
    if (checkTitleFormatPreferences === "true") {
      setTitleFormat(true);
      return;
    }
    setTitleFormat(false);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getFileData();
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    checkTitleFormatPreferences();
  }, []);
  return (
    <div>
      <Dialog
        fullScreen
        open={true}
        // onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography
              variant="h6"
              className={titleFormat ? classes.capitalize : classes.title}
            >
              {titleFormat ? AutoFormatTitle(note.title) : note.title}
            </Typography>
            <Button
              onClick={() => {
                handleModalUpdate(
                  note.id,
                  note.title,
                  note.description,
                  note.annotation
                );
                setModalUpdate(true);
              }}
            >
              <img src={editImage} className={classes.imageButtons} />
            </Button>
            <Button
              onClick={() => {
                setModalDelete(true);
              }}
            >
              <img src={trashImage} className={classes.imageButtons} />
            </Button>
          </Toolbar>
        </AppBar>

        <List>
          {note.description !== null ? (
            <ListItem className={classes.description}>
              <ListItemText primary={note.description} />
            </ListItem>
          ) : (
            ""
          )}
          <ListItem className={classes.footer}>
            <ListItemText
              primary={
                <div>
                  {" "}
                  <Button
                    onClick={() => {
                      setModalAddFile(true);
                    }}
                  >
                    <AttachFileIcon />
                  </Button>
                  {files.length > 0
                    ? files.map((item) => (
                      <div className={classes.linkDiv}>
                        <Button
                          variant="contained"
                          className={classes.buttonFile}
                          onClick={() => {
                            setFile(item);
                            setModalFile(true);
                          }}
                          className={item.title === "@base64TextImage" ? classes.hiddenFile : ""}
                        >
                          <Typography className={classes.fileTitle}>
                            {/* {console.log(item.file)} */}
                            {checkExtension(item.file)}
                            {item.title}
                          </Typography>
                        </Button>
                      </div>
                    ))
                    : ""}
                  {fileLoader ? (
                    <Typography align={"center"}>
                      {" "}
                      <Loading w={50} h={35} />
                    </Typography>
                  ) : (
                    ""
                  )}
                </div>
              }
            />
          </ListItem>

          <Divider />
          {noteLoader ? (
            <Typography align="center">
              <Loading />
            </Typography>
          ) : (
            <div className={classes.annotation}
              dangerouslySetInnerHTML={{
                __html: note.annotation[0] === "{" ? draftToHtml(JSON.parse(note.annotation)) : (note.annotation),
              }}
            ></div>
          )}


        </List>
      </Dialog>
      <AddFile
        option={modalAddFile}
        noteId={note.id}
        setModalFile={setModalAddFile}
        setRefresh={setRefresh}
        setFiles={setFiles}
        setFileLoader={setFileLoader}
      />
      <ModalFile
        option={modalFile}
        file={file}
        setRefresh={setRefresh}
        setModalFile={setModalFile}
      />
      {modalUpdate ? (
        <UpdateNote
          option={modalUpdate}
          note={formatNote}
          setModalUpdate={setModalUpdate}
          setRefresh={() => { }}
          setNote={setNote}
        />
      ) : (
        ""
      )}

      <Delete
        option={modalDelete}
        note={note}
        setModalDelete={setModalDelete}
        setRefresh={setRefresh}
        setNote={setNote}
      />
    </div>
  );
}
