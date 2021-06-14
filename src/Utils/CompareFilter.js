export const CompareFilter = (filter, title, description)=>{
    var expression = new RegExp(filter,"i");

    if (!expression.test(title) && !expression.test(description)) {
       return false;
    }
        return true;
    
}