const validateSearch = (search)=>{
    const validSearch = search.replace("%", "")
    return(validSearch);
}

export default validateSearch;