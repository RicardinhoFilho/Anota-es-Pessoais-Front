import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  TextField,
  Button,
  makeStyles,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import api from "../Services/api";
import Header from "../Components/Header";

import GoogleImage from "../Assets/google.svg";
import { GoogleLogin } from "react-google-login";
import { handleGoogleLogUp, handleGoogleLogIn, handleGoogleUpdateAccount } from "../Services/googleLoginAux";

import { useHistory } from 'react-router-dom';
import Loading from "../Components/Loading";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "40%",
    margin: "auto",
    marginTop: "2rem",
  },
  input: {
    width: "100%",
    margin: "auto",
    marginTop: "0.8em",
    marginBottom: "0.8em",
  },
  button: {
    marginTop: "1em",
  },
  negativeFeedback: {
    color: "#ff6961",
  },
  googleButton: {
    // marginLeft: "10rem"
  },
  googleImage: {
    marginRight: "1rem"
  },
}));

const UpdateAccount = () => {
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkNewPassword, setCheckNewPassword] = useState();
  const [error, setError] = useState(false);
  const [checkPassword, setCheckPassword] = useState();
  const [checkPasswordError, setCheckPasswordError] = useState(false);

  const [remember, setRemember] = useState(true);
  const [showRemember, setShowRemember] = useState(true);
  const [titleFormat, setTitleFormat] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleUpdateUser = async () => {
    try {
      const result = await api.patch("/api/user/update", { email, password, newPassword });

      // console.log(result);
      // window.location.href = "http://localhost:3000/login";
      history.push('/login');
    } catch {
      setError(true);
    }
  };

  async function responseGoogleSuccess(res) {
    const googleEmail = res.profileObj.email;
    const googlPassword = res.profileObj.googleId;
    handleGoogleUpdateAccount(email, password, googleEmail, googlPassword);
    await handleGoogleLogIn(googleEmail, googlPassword);
    history.push("/repositories");
  }
  async function checkRemember() {
    const rememberEmail = await localStorage.getItem("user");
    const rememberPassword = await localStorage.getItem("password");
    if (rememberEmail && rememberPassword) {
      setRemember(true);
      return;
    }

    setRemember(false);
    setShowRemember(false);

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

    checkRemember();
    checkTitleFormatPreferences();
  }, []);

  async function handlePreferencesSubmit() {
    if (!remember) {
      await localStorage.removeItem("user");
      await localStorage.removeItem("password");

      setShowRemember(false);
    }

    if (!titleFormat) {
      await localStorage.removeItem("titleFormatPreferences");
    }

    if (titleFormat) {
      await localStorage.setItem("titleFormatPreferences", "true");

    }
  }

  return (
    <>
      <Header />
      <form
        className={classes.root}
        onSubmit={(event) => {
          handleUpdateUser();
          event.preventDefault();
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          className={classes.title}
          align="center"
        >
          Atualizar Dados da Conta
        </Typography>

        <TextField
          className={classes.input}
          margin="normal"
          label="Usuário"
          value={email}
          required
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <br />
        <TextField
          className={classes.input}
          type="password"
          margin="normal"
          label="Senha"
          value={password}
          required
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <br />
        <TextField
          className={classes.input}
          type="password"
          margin="normal"
          label="Nova Senha"
          value={newPassword}
          required
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
          onBlur={() => {
            if (checkPassword !== password) {
              setCheckPasswordError(true);
            } else {
              setCheckPasswordError(false);
            }
          }}
          error={checkPasswordError}
        />
        <br />
        <TextField
          className={classes.input}
          type="password"
          margin="normal"
          label="Confirmar Nova Senha"
          value={checkNewPassword}
          required
          onChange={(event) => {
            setCheckNewPassword(event.target.value);
          }}
          onBlur={() => {
            if (checkNewPassword !== newPassword) {
              setCheckPasswordError(true)
            } else {
              setCheckPasswordError(false)
            }
          }}
          error={checkPasswordError}
        />
        <br />
        {error ? (
          <Typography className={classes.negativeFeedback}>
            Dados Inválidos!
          </Typography>
        ) : (
          ""
        )}
        {checkPasswordError ? (
          <Typography className={classes.negativeFeedback}>
            Senhas não coincidem!
          </Typography>
        ) : (
          ""
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Atualizar
        </Button>
      </form>

      <form className={classes.root} onSubmit={() => { console.log("submit") }}>
        <Typography
          variant="h5"
          component="h2"
          className={classes.title}
          align="center"
        >
          Utilizar Conta Google
        </Typography>

        <TextField
          className={classes.input}
          margin="normal"
          label="Usuário"
          value={email}
          required
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <br />
        <TextField
          className={classes.input}
          type="password"
          margin="normal"
          label="Senha"
          value={password}
          required
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <br />
        <GoogleLogin
          clientId={"65361440743-tddgjjutih8jt1sraqiebbh5uaoctdnk.apps.googleusercontent.com"}
          render={renderProps => (
            <Button
              variant="contained"
              color="primary"
              className={classes.googleButton}
              onClick={renderProps.onClick} disabled={renderProps.disabled}
              type="submit"
            >
              <img
                src={GoogleImage}
                alt="GoogleImage"
                className={classes.googleImage}
              />{" "}
              Cadastrar conta Google
            </Button>
          )}
          onSuccess={responseGoogleSuccess}
          // onFailure={responseGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
      </form>

      <form
        className={classes.root}
        onSubmit={
          (ev) => {
            ev.preventDefault();
            setLoading(true);
            setInterval(function () {
              setLoading(false);
            }, 3000);

            handlePreferencesSubmit();
          }
        }
      >
        <Typography
          variant="h5"
          component="h2"
          className={classes.title}
          align="center"
        >
          Editar Preferencias
        </Typography><br /><br />
        {showRemember ? (<FormControlLabel
          className={classes.checkBox}
          label={"Lembrar de mim"}
          control={
            <Switch
              onChange={(ev) => {
                setRemember(!remember);
              }}
              type="checkbox"
              color="primary"
              checked={remember}
            />
          }
        />) : ""}

        <FormControlLabel
          className={classes.checkBox}
          label={"Auto Formatação Visual de Títulos"}
          control={
            <Switch
              onChange={(ev) => {
                setTitleFormat(!titleFormat);
              }}
              type="checkbox"
              color="primary"
              checked={titleFormat}
            />
          }
        />
        <br />
        {loading ? <Typography align={"center"}><Loading w={50} h={100} t={1000} /></Typography> : ""}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Confirmar
        </Button>

      </form>
    </>
  );
};

export default UpdateAccount;
