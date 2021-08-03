import React, { useState } from "react";
import {
  Card,
  Typography,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";
import api from "../Services/api";
import Header from "../Components/Header";
import { useHistory } from "react-router-dom";
import { GoogleLogin, } from 'react-google-login';

import { handleGoogleLogUp, handleGoogleLogIn } from "../Services/googleLoginAux";

import GoogleImage from "../Assets/google.svg";

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
    marginLeft: "10rem"
  },
  googleImage: {
    marginRight: "1rem"
  },
}));

const SingUp = () => {
  const styles = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checkPassword, setCheckPassword] = useState();
  const [checkPasswordError, setCheckPasswordError] = useState(false);
  const history = useHistory();

  const classes = useStyles();

  const handleLogUp = async () => {
    try {
      const result = await api.post("/api/user/logup", { email, password });

      // console.log(result);
      await localStorage.setItem("user", email);
      await localStorage.setItem("password", password);
      history.push("/anotacoes-pessoais/login");
    } catch {
      setError(true);
    }
  };


  async function responseGoogleSuccess(res) {
    const email = res.profileObj.email;
    const password = res.profileObj.googleId;

    await handleGoogleLogUp(email, password);
    await handleGoogleLogIn(email, password);
    history.push("/anotacoes-pessoais/repositories");
  }

  return (
    <>
      <Header />
      <form
        className={styles.root}
        onSubmit={(event) => {
          handleLogUp();
          event.preventDefault();
        }}
      >
        <TextField
          className={styles.input}
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
          className={styles.input}
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
          className={styles.input}
          type="password"
          margin="normal"
          label="Confirmar Senha"
          value={checkPassword}
          required
          onChange={(event) => {
            setCheckPassword(event.target.value);
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
        {error ? (
          <Typography className={styles.negativeFeedback}>
            Dados Inválidos!
          </Typography>
        ) : (
          ""
        )}
        {checkPasswordError ? (
          <Typography className={styles.negativeFeedback}>
            Senhas não coincidem!
          </Typography>
        ) : (
          ""
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.button}
        >
          Cadastrar
        </Button>

        <GoogleLogin
          clientId={"65361440743-tddgjjutih8jt1sraqiebbh5uaoctdnk.apps.googleusercontent.com"}
          render={renderProps => (
            <Button
              variant="contained"
              color="primary"
              className={styles.googleButton}
              onClick={renderProps.onClick} disabled={renderProps.disabled}
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

    </>
  );
};

export default SingUp;
