import React,{useEffect,useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import {Link} from "react-router-dom";
import brokenToken  from "../Services/brokenToken";
import {useHistory} from "react-router-dom";

import sinsoftIcon from "../Assets/teste2.png"

import validateSearch from "../Utils/ValidateSearch";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  link:{
    textDecoration:"none",
    color:"inherit"
  },
  logo:{
    height:"60px",
    marginTop: "0.8rem",
    marginBut: "0.8rem",
  }
}));

export default function Header() {
  const classes = useStyles();
  const[search, setSearch] = useState("");
  const history = useHistory();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="a" noWrap>
            <a target="_blank" href="http://www.sinsoft.com.br/index.php">
            <img src={sinsoftIcon} alt="logo sinsoft" className={classes.logo} />
            </a>
          </Typography>
          
          <Typography className={classes.title} variant="h7" noWrap>
          <Link className={classes.link} to="/anotacoes-pessoais/repositories">Repositórios</Link>
          </Typography>

          <Typography className={classes.title} variant="h7" noWrap>
          <Link className={classes.link} to="/anotacoes-pessoais/login" onClick={
            brokenToken
          }>Sair</Link>
          </Typography>

          <Typography className={classes.title} variant="h7" noWrap>
          <Link className={classes.link} to="/anotacoes-pessoais/updateAccount">Minha Conta</Link>
          </Typography>
          
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form onSubmit={(event) =>{
              event.preventDefault();
              history.push(`/anotacoes-pessoais/search/${search}`)
            }}>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(ev)=>{

                const search = validateSearch(ev.target.value);
                setSearch(search);
              }}
            />
            </form>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}