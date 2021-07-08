import { useRef, useState, useEffect } from "react";
import api from "../../Services/api";
import checkTitle from "../../Utils/CheckTitle";
import { makeStyles } from "@material-ui/core/styles";
import {
  Modal,
  TextField,
  Typography,
  Button,
  TextareaAutosize,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    textAlign: "center",
    justifyContent: "right",
    display: "block",
  },

  paper: {
    maxWidth: 1000,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    margin: "auto",
    marginTop: "8vw",
    overflowY: "initial",
  },
  form: {
    maxHeight: "30vw",
    overflowY: "auto",
  },
}));

const AddFile = ({ option, setModalFile, noteId, setRefresh, setFiles, setFileLoader }) => {
  const filesElement = useRef(null);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const sendFile = async () => {
    try {
      const dataForm = new FormData();
      for (const file of filesElement.current.files) {
        dataForm.append("file", file);
        dataForm.append("title", title);
        dataForm.append("noteId", noteId);
      }
      const token = localStorage.getItem("token");
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      const res = await api.post(`/api/files/${noteId}`, dataForm);
      const files = await api.get(`/api/files/${noteId}`);
      setFiles(files.data);
    } catch {
      window.alert("Não foi possível gravar o anexo!")
    }


    setFileLoader(false);
    // console.log(res);
  };

  const handleClose = () => {
    setOpen(false);
    setModalFile(false);
  };

  useEffect(() => {
    if (open != option) {
      setOpen(option);
    }
  });

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <div className={classes.paper}>
        <Typography variant="h6" align="center" id="title">
          Adicionar Anexo!
        </Typography>
        <form
          className={classes.form}
          onSubmit={(event) => {

            //console.log(titleError.isValid)
            if (titleError) {


              setFileLoader(true);
              sendFile();
              event.preventDefault();
              //setRefresh(true);

              setTitle("");
              handleClose();
            }
            event.preventDefault();
          }}
        >
          <TextField
            label="Título"
            margin="normal"
            value={title}
            required
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
          <br />
          <input type="file" multiple ref={filesElement} required />
          <br />
          <br />
          <br />
          <br />

          <Button type="submit" variant="contained" color="primary" id="button">
            Confirmar
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AddFile;
