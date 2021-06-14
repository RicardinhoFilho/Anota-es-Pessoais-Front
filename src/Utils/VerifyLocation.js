
//Checar localização para verificar quais funcções nosso header poderá executar
const verifyLocation = (location)=>{
    if(location.indexOf("notes") == 1 || location.indexOf("repositories") == 1){
        return true;
    }

    return false;

}


export default verifyLocation;