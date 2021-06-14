
import React from "react";
import errorImage from "../Assets/anotando.gif";
import {Typography,makeStyles} from "@material-ui/core"

import Loader from "react-loader-spinner";


const useStyles = makeStyles((theme) => ({
   
    errorImage:{
        width: "40vw",
        marginTop: "5vw",
        borderRadius: "5vw"
    }
  }));

export  default function Loading({w,h, t}){
    const classes = useStyles();

    return(
        <Loader
        type="Oval"
        color="#00BFFF"
        height={w? w : 100}
        width={h?  h : 100}
         timeout={t} //3 secs
      />
    )
   
}
