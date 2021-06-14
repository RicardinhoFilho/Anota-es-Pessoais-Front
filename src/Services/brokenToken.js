 async function brokenToken(){
  await  localStorage.setItem("token", "");
 }   

 export default brokenToken;
