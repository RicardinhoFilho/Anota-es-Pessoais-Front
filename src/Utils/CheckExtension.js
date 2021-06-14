import React from "react";

import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import GifIcon from '@material-ui/icons/Gif';

const checkExtension = (file)=>{

    const size = file.length;
    const extension = (file.substr(size-3));
    if (extension == "pdf") return <PictureAsPdfRoundedIcon/>
    if (extension == "peg" || extension == "png" || extension == "jpg" || extension == "svg") return <ImageIcon/>
    if (extension == "gif") return <GifIcon/>
    
    return <DescriptionIcon/>
}


export default checkExtension;