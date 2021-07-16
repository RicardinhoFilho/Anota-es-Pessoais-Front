import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
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
import SearchIcon from "@material-ui/icons/Search";
import ListIcon from "@material-ui/icons/List";

import { CompareFilter } from "../Utils/CompareFilter";
import { AutoFormatTitle } from "../Utils/AutoFormatTitle";

import DeleteNote from "../Components/Notes/DeleteNote";
import UpdateNote from "../Components/Notes/UpdateNote";
import Note from "../Components/Notes/Note";

import Header from "../Components/Header";
import Loading from "../Components/Loading";

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: window.screen.width - 500,
    backgroundColor: theme.palette.background.paper,
    margin: "auto",
    marginTop: "1em",
  },
  item: {
    border: "solid 1.2px",
    borderColor: "#d3d3d3",
    borderColor: "#d3d3d3",
    borderRadius: "0.25rem",
    backgroundColor: "#d3d3d3",
    marginTop: "0.6em",
  },
  title: {
    width: "100%",
    marginTop: "1em",
    marginBottom: "0.1rem",
  },
  list: {
    maxHeight: window.screen.height - 500,
    overflowY: "scroll",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
  firstButtons: {
    display: "flex",
    justifyContent: "space-around",
  },
  hidden: {
    display: "none",
  },
  capitalize: {
    width: "100%",
    marginBottom: "1em",
    textTransform: "capitalize",
  },
  loader: {
    marginTop: 200,
  },
  headers: {
    maxWidth: window.screen.width - 500,
    display: "flex",
  },
}));

const Search = () => {
  const [repositories, setRepositories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalOpenDetail, setModalOpenDetails] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [note, setNote] = useState([]);

  const [filter, setFilter] = useState("");

  const { search } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  const [titleFormat, setTitleFormat] = useState(true);

  const handleShowDetails = (note) => {
    setNote(note);
    setModalOpenDetails(true);
    //console.log("aqui",note)
  };

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
    checkTitleFormatPreferences();
    const token = localStorage.getItem("token");
    async function getData() {
      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
          const result = await api.post("/api/search", { search });
          setRepositories(result.data.repositories);
          setNotes(result.data.notes);
          setLoading(false);
          setRefresh(false);
        } catch {
          history.push("/login");
        }
      } else {
        history.push("/login");
      }
    }

    getData();
  }, [search, refresh]);

  if (loading) {
    return (
      <>
        <Header />
        <Typography align="center" className={classes.loader}>
          <Loading />
        </Typography>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.headers}>
        <Typography
          variant="h5"
          component="h2"
          className={classes.title}
          align="center"
        >
          Resultado busca: <b>{search}</b>
        </Typography>
        <Typography align="" className={classes.filter}>
          <TextField
            margin="center"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
            label={<ListIcon />}
          />
        </Typography>
      </div>
      {repositories.length > 0 ? (
        <Typography
          variant="h6"
          component="h2"
          className={classes.title}
          align="center"
        >
          Repositórios: {repositories.length}
        </Typography>
      ) : (
        ""
      )}

      <div className={classes.root}>
        <List className={classes.list}>
          {repositories.map((item) => (
            <Link
              className={
                filter.length > 0 &&
                !CompareFilter(filter, item.title, item.description)
                  ? classes.hidden
                  : classes.link
              }
              to={`/notes/${item.id}`}
            >
              <ListItemLink key={item.id} className={classes.item}>
                <Typography
                  variant="h4"
                  component="h2"
                  className={titleFormat ? classes.capitalize : classes.title}
                >
                  {titleFormat ? AutoFormatTitle(item.title) : item.title}
                </Typography>

                <Typography variant="spam">{item.description}</Typography>
              </ListItemLink>
            </Link>
          ))}
        </List>
      </div>

      {notes.length > 0 ? (
        <Typography
          variant="h6"
          component="h2"
          className={classes.title}
          align="center"
        >
          Notas: {notes.length}
        </Typography>
      ) : (
        ""
      )}

      <div className={classes.root}>
        <List className={classes.list}>
          {notes.map((item) => (
            <Link
              className={
                filter.length > 0 &&
                !CompareFilter(filter, item.title, item.description)
                  ? classes.hidden
                  : classes.link
              }
              to={`/notes/${item.repository_id}`}
            >
              <ListItemLink key={item.id} className={classes.item}>
                <Typography
                  variant="h4"
                  component="h2"
                  className={titleFormat ? classes.capitalize : classes.title}
                >
                  {titleFormat ? AutoFormatTitle(item.title) : item.title}
                </Typography>

                <Typography variant="spam">{item.description}</Typography>

                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    handleShowDetails(item);
                  }}
                >
                  <SearchIcon />
                </Button>
              </ListItemLink>
            </Link>
          ))}
        </List>
      </div>

      <DeleteNote
        option={modalDelete}
        note={note}
        setModalDelete={setModalDelete}
        setRefresh={setRefresh}
        setNote={setNote}
      />
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

export default Search;
