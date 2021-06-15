import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import { Link, useHistory } from "react-router-dom";
import plusImage from "../Assets/Plus.svg";
import trashImage from "../Assets/Trash.svg";
import editImage from "../Assets/Edit.svg";
import SearchIcon from "@material-ui/icons/Search";
import Loading from "../Components/Loading";

import { AutoFormatTitle } from "../Utils/AutoFormatTitle";
import { CompareFilter } from "../Utils/CompareFilter";
import DeleteNote from "../Components/Notes/DeleteNote";
import AddNote from "../Components/Notes/AddNote";
import UpdateNote from "../Components/Notes/UpdateNote";
import Note from "../Components/Notes/Note";

import ListIcon from "@material-ui/icons/List";

import {
  makeStyles,
  List,
  ListItemText,
  ListItem,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
} from "@material-ui/core";

import api from "../Services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    margin: "auto",
    marginTop: "1em",
  },
  item: {
    border: "solid 1.2px",
    marginTop: "0.6em",
    backgroundColor: "#e5e4e2",
    borderColor: "#d3d3d3",
  },
  title: {
    width: "100%",
    // marginBottom: "1em",
  },
  plus: {
    backgroundColor: "#3f51b5",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
  firstButtons: {
    display: "flex",
    justifyContent: "space-around",
    alignItems:"center",
    marginBottom:"3rem"
  },
  hidden: {
    display: "none",
  },
  filter: {
    marginTop: "-2rem",
  },
  list: {
    maxHeight: (window.screen.height - 340),
    overflowY: "scroll"
  },
  capitalize: {
    width: "100%",
    marginBottom: "1em",
    textTransform: "capitalize"
  },
  loader: {
    marginTop: 200
  },
  headers: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
}));

const Notes = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [repository, setRepository] = useState([]);
  const [note, setNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalOpenDetail, setModalOpenDetails] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState("");
  const[openInNewTab,setOpenInNewTab] = useState(true);

  const [titleFormat, setTitleFormat] = useState(true);

  let testModals = true;

  function handleShowDescription() {
    setShowDescription(!showDescription);
  }

  function handleModalDelete(id, title, description, annotation) {
    setNote({ id, title, description, annotation });
    setModalDelete(true);
  }

  function handleModalUpdate(id, title, description, annotation) {
    setNote({ id, title, description, annotation });
    //console.log(note)
    setModalUpdate(true);
    testModals = false;
  }

  function handleOpenNoteDetails(id, title, description, annotation) {
    setNote({ id, title, description, annotation });

    if (testModals) {
      setModalOpenDetails(true);
    }
  }

  const history = useHistory();
  const classes = useStyles();

  async function checkTitleFormatPreferences() {
    const checkTitleFormatPreferences = await localStorage.getItem("titleFormatPreferences");
    if (checkTitleFormatPreferences === "true") {
      setTitleFormat(true);
      return;
    }
    setTitleFormat(false);
  }

  async function checkNotesOption(){
    const checkNotesOption = await localStorage.getItem("openInNewTab");
    if (checkNotesOption === "true") {
      setOpenInNewTab(true);
      return;
    }
    setOpenInNewTab(false);
  }

  useEffect(() => {
    checkTitleFormatPreferences();
    checkNotesOption();
    async function getData() {
      const token = localStorage.getItem("token");
      try {
        api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        const notes = await api.get(`/api/notes/${id}`);
        const repository = await api.get(`/api/repositories/${id}`);

        setRepository(repository.data);
        setNotes(notes.data);
        setLoading(false);
        setRefresh(false);
      } catch (err) {
        history.push("/login");
      }
    }

    getData();
  }, [id, refresh]);

  if (loading) {
    return (
      <>
        <Header data={notes} />
        <Typography align="center" className={classes.loader}>
          <Loading />
        </Typography>
      </>);
  }

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }


  // console.log("modal update", modalUpdate);
  return (
    <>
      <Header data={notes} />
      <div className={classes.root}>
        <div className={classes.headers}>
          <Typography
            variant="h5"
            component="h2"
            className={titleFormat ? classes.capitalize : classes.title}
            align="center"
          >
            {titleFormat ? AutoFormatTitle(repository.title) : repository.title}
          </Typography>

          <Typography
            variant="h6"
            component="h2"
            className={classes.title}
            align="center"
          >
            Total Anotações: {notes.length}
          </Typography>
        </div>
        <div className={classes.firstButtons}>
          <AddNote
            option={modalAdd}
            setModalAdd={setModalAdd}
            repId={id}
            setRefresh={setRefresh}
          />

          <Typography align="center" className={classes.filter}>
            <TextField
              margin="normal"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value);
              }}
              label={<ListIcon />}
            />
          </Typography>

          <FormControlLabel
            label={"Descrições"}
            control={
              <Switch
                onChange={handleShowDescription}
                name="checkedB"
                color="primary"
              />
            }
          />
        </div>
        <div className={classes.filter}>

        </div>
        <List className={classes.list}>
          {notes.map((item) => (
            <Link
              className={
                filter.length > 0 &&
                  !CompareFilter(filter, item.title, item.description)
                  ? classes.hidden
                  : classes.link
              }
              onClick={() => {

                openInNewTab? window.open(`http://localhost:3000/note/${item.id}`, "_blank")
                :  handleOpenNoteDetails(
                  item.id,
                  item.title,
                  item.description,
                  item.annotation
                )
               
              }}
            >
              <ListItemLink key={item.id} className={classes.item}>
                <Typography
                  variant="h4"
                  component="h2"
                  className={titleFormat ? classes.capitalize : classes.title}
                >
                  {titleFormat ? AutoFormatTitle(item.title) : item.title}
                </Typography>

                <Button
                  primary
                  onClick={(event) => {
                    event.preventDefault();
                    handleModalUpdate(
                      item.id,
                      item.title,
                      item.description,
                      item.annotation
                    );
                  }}
                >
                  <img src={editImage} className={classes.edit} />
                </Button>

                <Button
                  primary
                  onClick={() => {
                    handleModalDelete(
                      item.id,
                      item.title,
                      item.description,
                      item.annotation
                    );

                    testModals = false;
                  }}
                >
                  <img src={trashImage} className={classes.trash} />
                </Button>
              </ListItemLink>
              {showDescription ? (
                <Typography variant="spam">
                  {("\n", item.description)}{" "}
                </Typography>
              ) : (
                ""
              )}
            </Link>
          ))}
        </List>
        <DeleteNote
          option={modalDelete}
          note={note}
          setModalDelete={setModalDelete}
          setRefresh={setRefresh}
          setNote={setNote}
        />
      </div>

      {modalUpdate ? (
        <UpdateNote
          option={modalUpdate}
          note={note}
          setModalUpdate={setModalUpdate}
          setRefresh={setRefresh}
          setNote={setNote}
        />
      ) : (
        ""
      )}

      <Note
        option={modalOpenDetail}
        note={note}
        setModalOpenDetails={setModalOpenDetails}
        setModalDelete={setModalDelete}
        setModalUpdate={setModalUpdate}
        setRefresh={setRefresh}
        refresh={refresh}
      />
    </>
  );
};

export default Notes;
