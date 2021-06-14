import React from "react";
import errorImage from "../Assets/anotando.gif";
import {makeStyles,Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
   
    root:{
        width: "100%",
        margin: "auto",
        marginTop: "2rem",
    },
    img:{
        width: "40vw",
        marginTop: "5vw",
        borderRadius: "5vw"
    }
}))
const Error404 = ()=>{
    const classes = useStyles();
    return (
      
   
        <div className={classes.root}>
             
        <Typography variant="h2" align="center">Esta página não existe</Typography>
        <Typography align="center"><img src={errorImage} className={classes.img}/></Typography>
        </div>
    )
}

 export default Error404