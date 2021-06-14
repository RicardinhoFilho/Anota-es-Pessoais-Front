import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  TextField,
  Button,
  makeStyles,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import api from "../Services/api";
import Header from "../Components/Header";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import GoogleImage from "../Assets/google.svg";

import { GoogleLogin } from "react-google-login";
import { handleGoogleLogUp, handleGoogleLogIn } from "../Services/googleLoginAux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50vw",
    margin: "auto",
    marginTop: "2rem",
  },
  input: {
    width: "100%",
    margin: "auto",
    marginTop: "0.8em",
    marginBottom: "0.8em",
  },
  title: {
    marginTop: "1em",
  },
  button: {
    marginTop: "1em",
  },
  negativeFeedback: {
    color: "#ff6961",
  },
  link: {
    // marginLeft: "2vw",
    textDecoration: "none",
  },
  checkBox: {
    marginLeft: "20rem",
  },
  googleButton: {
    marginLeft: "10rem"
  },
  googleImage: {
    marginRight: "1rem"
  },
}));

const Login = () => {
  const styles = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(false);
  const history = useHistory();

  const handleLogIn = async () => {
    try {
      const {
        data: { token },
      } = await api.post("/api/user/login", { email, password });

      localStorage.setItem("token", JSON.stringify(token));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      //window.location.href = "http://191.252.64.232/repositories";
      history.push("/repositories");
    } catch (err) {
      setError(true);
    }
  };

  const classes = useStyles();

  useEffect(() => {
    async function remember() {
      const rememberEmail = await localStorage.getItem("user");
      const rememberPassword = await localStorage.getItem("password");

      if (rememberEmail && rememberPassword) {
        setEmail(rememberEmail);
        setPassword(rememberPassword);
      }
    }
    remember();
  }, []);

  async function responseGoogleSuccess(res) {
    const googleEmail = res.profileObj.email;
    const googlPassword = res.profileObj.googleId;
    //window.alert(`${googleEmail} +  ${googlPassword}`);
    await handleGoogleLogIn(googleEmail, googlPassword);
    history.push("/repositories");
  }

  return (
    <>
      <Header />
      <Typography
        variant="h2"
        component="h1"
        className={classes.title}
        align="center"
      >
        Anotações Pessoais
      </Typography>
      <form
        className={styles.root}
        onSubmit={(event) => {
          handleLogIn();
          if (remember) {
            //const hashPassword = bcrypt.hashSync(password,8);
            localStorage.setItem("user", email);
            localStorage.setItem("password", password);
          }

          if (!remember) {
            localStorage.removeItem("user");
            localStorage.removeItem("password");
          }
          event.preventDefault();
          //
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
        {error ? (
          <Typography className={styles.negativeFeedback}>
            Dados Inválidos!
          </Typography>
        ) : (
          ""
        )}
        <div className={classes.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.button}
          >
            Entrar
          </Button>

          <FormControlLabel
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
          />
        </div>
        <br />
        <Link to="/singUp" className={classes.link}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.button}
          >
            Não posssuo conta
          </Button>
        </Link>
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
              Entrar com Conta google
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

export default Login;
