import React, { useState, useEffect } from "react";
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

import { CompareFilter } from "../Utils/CompareFilter";

import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

import AddRepository from "../Components/Repositories/AddRepository";
import DeleteRepository from "../Components/Repositories/DeleteRepository";
import UpdateRepository from "../Components/Repositories/UpdateRepository";

import Header from "../Components/Header";
import { Link, useHistory } from "react-router-dom";
import plusImage from "../Assets/Plus.svg";
import trashImage from "../Assets/Trash.svg";
import editImage from "../Assets/Edit.svg";
import loginImage from "../Assets/login.jpg";
import ListIcon from "@material-ui/icons/List";
import Loading from "../Components/Loading";

import {AutoFormatTitle} from "../Utils/AutoFormatTitle";

import api from "../Services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 1000,
    backgroundColor: theme.palette.background.paper,
    margin: "auto",
    marginTop: "1em",
  },
  list: {

    maxHeight: (window.screen.height - 280),
    overflowY: "scroll",

  },
  item: {
    border: "solid 1.2px",
    marginTop: "0.6em",
    backgroundColor: "#e5e4e2",
    borderColor: "#d3d3d3",
  },
  title: {
    width: "100%",
    // marginBottom: "0.1rem",
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
    marginTop:"-1.2rem",
  },
  repImage: {
    width: "200px",
    height: "100px",
  },
  hidden: {
    display: "none",
  },
  capitalize: {
    width: "100%",
    marginBottom: "1em",
    textTransform: "capitalize"
  },
  loader: {
    marginTop: 200
  },
}));

const Repositories = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [rep, setRep] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [refresh, setRefresh] = useState(false);
  

  const classes = useStyles();
  const history = useHistory();

  const [filter, setFilter] = useState("");

  const [titleFormat, setTitleFormat] = useState(true);



  function handleShowDescription(option) {
    setShowDescription(option);
  }
  function handleModalDelete(id, title, description) {
    setRep({ id: [id], title: [title], description: [description] });
    setModalDelete(true);
  }

  function handleModalUpdate(id, title, description) {
    setRep({ id: [id], title: [title], description: [description] });
    setModalUpdate(true);
  }

  function handleModalAddOpen() {
    setModalAdd(true);
  }

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  async function checkTitleFormatPreferences() {
    const checkTitleFormatPreferences = await localStorage.getItem("titleFormatPreferences");
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
          const result = await api.get("/api/repositories");

          setData(result.data);
          setRefresh(false);
        } catch {
          history.push("/login");
        }
      } else {
        history.push("/login");
      }
    }

    getData();

    setLoading(false);
  }, [refresh]);

  if (loading) {
   return( <>
    <Header />
    <Typography align="center" className={classes.loader}>
      <Loading />
    </Typography>
    </>)
  }

 // console.log()

  return (
    <>
      <Header />
      <div className={classes.root}>
        <Typography
          variant="h6"
          component="h2"
          className={classes.title}
          align="center"
        >
          Total Repositórios: {data.length}
        </Typography>

        <div className={classes.firstButtons}>
          <FormControlLabel
            label="Adicionar"
            onClick={() => handleModalAddOpen()}
            control={
              <Button primary>
                <CreateNewFolderIcon color="primary" />
              </Button>
            }
          />

          <TextField
            margin="normal"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
            label={<ListIcon />}
          />

          <FormControlLabel
            label={"Descrições"}
            control={
              <Switch
                onChange={(ev) => {
                  handleShowDescription(ev.target.checked);
                }}
                type="checkbox"
                name="checkedB"
                color="primary"
                value="true"
              />
            }
          />
        </div>
        <div className={classes.oveflow}>
          <div className={classes.list}>
            {/* <List > */}
            {filter.length > 0
              ? data.map((item) => (
                <Link
                  className={classes.link}
                  to={`/notes/${item.id}`}
                  className={
                    CompareFilter(filter, item.title, item.description)
                      ? classes.link
                      : classes.hidden
                  }
                >
                  <ListItemLink key={item.id} className={classes.item}>
                    <Typography
                      variant="h4"
                      component="h2"
                      className={titleFormat? classes.capitalize : classes.title}
                    >
                      {titleFormat? AutoFormatTitle(item.title) : item.title}
                    </Typography>
                    <Button
                      primary
                      onClick={(event) => {
                        handleModalUpdate(
                          item.id,
                          item.title,
                          item.description
                        );
                        event.preventDefault();
                      }}
                    >
                      <img src={editImage} className={classes.edit} />
                    </Button>
                    <Button
                      primary
                      onClick={(event) => {
                        handleModalDelete(
                          item.id,
                          item.title,
                          item.description
                        );
                        event.preventDefault();
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
              ))
              : data.map((item) => (
                <Link className={classes.link} to={`/notes/${item.id}`}>
                  <ListItemLink key={item.id} className={classes.item}>
                    <Typography
                      variant="h4"
                      component="h2"
                      className={titleFormat? classes.capitalize : classes.title}
                    >
                      {titleFormat? AutoFormatTitle(item.title) : item.title}
                    </Typography>
                    <Button
                      primary
                      onClick={(event) => {
                        handleModalUpdate(
                          item.id,
                          item.title,
                          item.description
                        );
                        event.preventDefault();
                      }}
                    >
                      <img src={editImage} className={classes.edit} />
                    </Button>
                    <Button
                      primary
                      onClick={(event) => {
                        handleModalDelete(
                          item.id,
                          item.title,
                          item.description
                        );
                        event.preventDefault();
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
            {/* </List> */}
          </div>
        </div>
        <AddRepository
          option={modalAdd}
          setModalAdd={setModalAdd}
          setRefresh={setRefresh}
        />
        <DeleteRepository
          option={modalDelete}
          rep={rep}
          setModalDelete={setModalDelete}
          feedback={setFeedback}
          setRefresh={setRefresh}
        />
        <UpdateRepository
          option={modalUpdate}
          rep={rep}
          setModalUpdate={setModalUpdate}
          setRefresh={setRefresh}
        />
      </div>


    </>
  );
};

export default Repositories;
